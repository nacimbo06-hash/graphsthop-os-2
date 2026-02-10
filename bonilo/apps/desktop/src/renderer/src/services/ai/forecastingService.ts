/**
 * AI Forecasting Service - Bonilo
 * 
 * Implements demand forecasting with Algerian market specifics:
 * - Ramadan demand multipliers
 * - Friday couscous patterns
 * - Salary period boost (25th-5th)
 * - Harvest seasons (olive, dates)
 */

// ===== TYPES =====

export type TrendDirection = 'rising' | 'falling' | 'stable';

export interface ForecastResult {
    date: Date;
    predictedDemand: number;
    lowerBound: number;
    upperBound: number;
    confidence: number;
    factors: string[];
    trend?: TrendDirection;
}

export interface AnomalyResult {
    type: 'spike' | 'drop' | 'unusual_pattern';
    severity: 'low' | 'medium' | 'high';
    message: string;
    affectedProducts: string[];
    suggestedAction: string;
}

export interface ReorderSuggestion {
    productId: string;
    productName: string;
    currentStock: number;
    predictedDemand: number;
    suggestedQuantity: number;
    priority: 'critical' | 'urgent' | 'normal';
    reason: string;
    savingsPotential?: number;
}

export interface AIInsight {
    id: string;
    type: 'forecast' | 'anomaly' | 'opportunity' | 'alert' | 'recommendation';
    title: string;
    description: string;
    importance: 'low' | 'medium' | 'high' | 'critical';
    icon: string;
    actionLabel?: string;
    actionRoute?: string;
    data?: Record<string, unknown>;
    timestamp: Date;
}

export interface AlgerianCalendarEvent {
    name: string;
    nameAr: string;
    startDate: Date;
    endDate?: Date;
    type: 'religious' | 'national' | 'seasonal' | 'economic';
    demandMultipliers: Record<string, number>;
}

// ===== ALGERIAN CALENDAR =====

/**
 * Islamic holidays shift ~10-12 days earlier each Gregorian year.
 * These are pre-calculated approximate Gregorian dates for key Islamic events.
 * Source: astronomical calculations for 1 Ramadan, 1 Shawwal, 10 Dhul Hijjah, 12 Rabi al-Awwal.
 */
const ISLAMIC_DATES: Record<number, {
    ramadanStart: [number, number]; // [month (0-indexed), day]
    ramadanEnd: [number, number];
    eidFitrStart: [number, number];
    eidFitrEnd: [number, number];
    eidAdhaStart: [number, number];
    eidAdhaEnd: [number, number];
    mawlid: [number, number];
}> = {
    2024: {
        ramadanStart: [2, 11],  // March 11
        ramadanEnd: [3, 9],     // April 9
        eidFitrStart: [3, 10],  // April 10
        eidFitrEnd: [3, 12],
        eidAdhaStart: [5, 16],  // June 16
        eidAdhaEnd: [5, 19],
        mawlid: [8, 15],       // September 15
    },
    2025: {
        ramadanStart: [1, 28],  // February 28
        ramadanEnd: [2, 29],    // March 29
        eidFitrStart: [2, 30],  // March 30
        eidFitrEnd: [3, 1],
        eidAdhaStart: [5, 6],   // June 6
        eidAdhaEnd: [5, 9],
        mawlid: [8, 4],        // September 4
    },
    2026: {
        ramadanStart: [1, 18],  // February 18
        ramadanEnd: [2, 19],    // March 19
        eidFitrStart: [2, 20],  // March 20
        eidFitrEnd: [2, 22],
        eidAdhaStart: [4, 27],  // May 27
        eidAdhaEnd: [4, 30],
        mawlid: [7, 25],       // August 25
    },
    2027: {
        ramadanStart: [1, 7],   // February 7
        ramadanEnd: [2, 8],     // March 8
        eidFitrStart: [2, 9],   // March 9
        eidFitrEnd: [2, 11],
        eidAdhaStart: [4, 16],  // May 16
        eidAdhaEnd: [4, 19],
        mawlid: [7, 14],       // August 14
    },
    2028: {
        ramadanStart: [0, 27],  // January 27
        ramadanEnd: [1, 25],    // February 25
        eidFitrStart: [1, 26],  // February 26
        eidFitrEnd: [1, 28],
        eidAdhaStart: [4, 4],   // May 4
        eidAdhaEnd: [4, 7],
        mawlid: [7, 3],        // August 3
    },
    2029: {
        ramadanStart: [0, 16],  // January 16
        ramadanEnd: [1, 14],    // February 14
        eidFitrStart: [1, 15],  // February 15
        eidFitrEnd: [1, 17],
        eidAdhaStart: [3, 24],  // April 24
        eidAdhaEnd: [3, 27],
        mawlid: [6, 24],       // July 24
    },
    2030: {
        ramadanStart: [0, 5],   // January 5
        ramadanEnd: [1, 3],     // February 3
        eidFitrStart: [1, 4],   // February 4
        eidFitrEnd: [1, 6],
        eidAdhaStart: [3, 13],  // April 13
        eidAdhaEnd: [3, 16],
        mawlid: [6, 13],       // July 13
    },
};

/**
 * Get Islamic dates for a given year.
 * Falls back to an approximate shift from the nearest known year.
 */
function getIslamicDates(year: number) {
    if (ISLAMIC_DATES[year]) return ISLAMIC_DATES[year];

    // Fallback: find nearest known year and shift by ~11 days/year
    const knownYears = Object.keys(ISLAMIC_DATES).map(Number).sort((a, b) => a - b);
    const nearest = knownYears.reduce((prev, curr) =>
        Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
    );
    const diff = year - nearest;
    const shiftDays = diff * -11; // Hijri shifts ~11 days earlier per Gregorian year

    const base = ISLAMIC_DATES[nearest];
    const shift = (m: number, d: number): [number, number] => {
        const date = new Date(year, m, d + shiftDays);
        return [date.getMonth(), date.getDate()];
    };

    return {
        ramadanStart: shift(base.ramadanStart[0], base.ramadanStart[1]),
        ramadanEnd: shift(base.ramadanEnd[0], base.ramadanEnd[1]),
        eidFitrStart: shift(base.eidFitrStart[0], base.eidFitrStart[1]),
        eidFitrEnd: shift(base.eidFitrEnd[0], base.eidFitrEnd[1]),
        eidAdhaStart: shift(base.eidAdhaStart[0], base.eidAdhaStart[1]),
        eidAdhaEnd: shift(base.eidAdhaEnd[0], base.eidAdhaEnd[1]),
        mawlid: shift(base.mawlid[0], base.mawlid[1]),
    };
}

// Product category demand multipliers for Ramadan
const RAMADAN_MULTIPLIERS: Record<string, number> = {
    'dates': 4.2,
    'milk': 2.1,
    'eggs': 1.8,
    'cheese': 1.6,
    'bread': 1.5,
    'beverages': 2.3,
    'meat': 1.9,
    'vegetables': 1.7,
    'fruits': 1.8,
    'sweets': 2.5,
    'oil': 1.4,
    'flour': 1.6,
    'default': 1.3,
};

// Friday couscous pattern
const FRIDAY_MULTIPLIERS: Record<string, number> = {
    'couscous': 2.5,
    'vegetables': 1.8,
    'meat': 1.6,
    'chickpeas': 1.9,
    'raisins': 1.5,
    'default': 1.1,
};

// Salary period boost (25th - 5th)
const SALARY_PERIOD_MULTIPLIERS: Record<string, number> = {
    'electronics': 1.4,
    'cleaning': 1.3,
    'beverages': 1.2,
    'snacks': 1.3,
    'default': 1.15,
};

// ===== ALGERIAN CALENDAR EVENTS =====

function getAlgerianCalendarEvents(year: number): AlgerianCalendarEvent[] {
    const hijri = getIslamicDates(year);

    return [
        // ── Islamic Holidays (shift every year) ──
        {
            name: 'Ramadan',
            nameAr: 'رمضان',
            startDate: new Date(year, hijri.ramadanStart[0], hijri.ramadanStart[1]),
            endDate: new Date(year, hijri.ramadanEnd[0], hijri.ramadanEnd[1]),
            type: 'religious',
            demandMultipliers: RAMADAN_MULTIPLIERS,
        },
        {
            name: 'Eid el-Fitr',
            nameAr: 'عيد الفطر',
            startDate: new Date(year, hijri.eidFitrStart[0], hijri.eidFitrStart[1]),
            endDate: new Date(year, hijri.eidFitrEnd[0], hijri.eidFitrEnd[1]),
            type: 'religious',
            demandMultipliers: { sweets: 3.0, clothes: 2.5, gifts: 2.0, default: 1.5 },
        },
        {
            name: 'Eid el-Adha',
            nameAr: 'عيد الأضحى',
            startDate: new Date(year, hijri.eidAdhaStart[0], hijri.eidAdhaStart[1]),
            endDate: new Date(year, hijri.eidAdhaEnd[0], hijri.eidAdhaEnd[1]),
            type: 'religious',
            demandMultipliers: { meat: 3.5, spices: 2.0, charcoal: 2.5, default: 1.4 },
        },
        {
            name: 'Mawlid',
            nameAr: 'المولد النبوي',
            startDate: new Date(year, hijri.mawlid[0], hijri.mawlid[1]),
            type: 'religious',
            demandMultipliers: { sweets: 2.0, candles: 1.8, default: 1.2 },
        },

        // ── Fixed Algerian National Holidays ──
        {
            name: 'Yennayer',
            nameAr: 'يناير',
            startDate: new Date(year, 0, 12), // January 12
            type: 'national',
            demandMultipliers: { couscous: 2.0, chicken: 1.8, sweets: 1.5, fruits: 1.5, default: 1.1 },
        },
        {
            name: 'Independence Day',
            nameAr: 'عيد الاستقلال',
            startDate: new Date(year, 6, 5), // July 5
            type: 'national',
            demandMultipliers: { beverages: 1.5, snacks: 1.4, meat: 1.3, default: 1.1 },
        },
        {
            name: 'Revolution Day',
            nameAr: 'عيد الثورة',
            startDate: new Date(year, 10, 1), // November 1
            type: 'national',
            demandMultipliers: { default: 1.05 },
        },

        // ── Seasonal Events ──
        {
            name: 'Date Harvest Season',
            nameAr: 'موسم جني التمور',
            startDate: new Date(year, 8, 1),  // September
            endDate: new Date(year, 10, 30),  // November
            type: 'seasonal',
            demandMultipliers: { dates: 0.8, default: 1.0 },
        },
        {
            name: 'Olive Harvest',
            nameAr: 'موسم الزيتون',
            startDate: new Date(year, 9, 15),  // October
            endDate: new Date(year, 11, 15),   // December
            type: 'seasonal',
            demandMultipliers: { oil: 0.85, olives: 0.9, default: 1.0 },
        },

        // ── Economic Events ──
        {
            name: 'Back to School',
            nameAr: 'الدخول المدرسي',
            startDate: new Date(year, 7, 25),  // August 25 (prep starts early)
            endDate: new Date(year, 8, 15),    // September 15
            type: 'economic',
            demandMultipliers: { stationery: 3.0, bags: 2.5, snacks: 1.5, default: 1.2 },
        },
    ];
}

// Check if date is in salary period (25th - 5th)
function isInSalaryPeriod(date: Date): boolean {
    const day = date.getDate();
    return day >= 25 || day <= 5;
}

// Check if date is Friday
function isFriday(date: Date): boolean {
    return date.getDay() === 5;
}

// Get active events for a date (also checks previous year for year-straddling events)
function getActiveEvents(date: Date): AlgerianCalendarEvent[] {
    const year = date.getFullYear();
    const events = [
        ...getAlgerianCalendarEvents(year),
        ...getAlgerianCalendarEvents(year - 1), // catch events that started last year
    ];
    return events.filter(event => {
        const start = event.startDate;
        const end = event.endDate || new Date(start.getTime() + 24 * 60 * 60 * 1000); // single-day events
        return date >= start && date <= end;
    });
}

// ===== FORECASTING ENGINE (Real Data Powered) =====

/** Sale item shape expected by the forecasting engine */
interface SaleRecord {
    timestamp: string | Date;
    items: { productId: string; quantity: number; total: number }[];
    totalAmount: number;
}

/**
 * Detect trend direction using simple linear regression over daily values.
 * Returns 'rising', 'falling', or 'stable'.
 */
function detectTrend(dailyValues: number[]): TrendDirection {
    if (dailyValues.length < 3) return 'stable';
    const n = dailyValues.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += dailyValues[i];
        sumXY += i * dailyValues[i];
        sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const mean = sumY / n;
    // Normalize slope relative to mean to get a percentage change per day
    if (mean === 0) return 'stable';
    const normalizedSlope = slope / mean;
    if (normalizedSlope > 0.03) return 'rising';   // >3% per day
    if (normalizedSlope < -0.03) return 'falling';  // <-3% per day
    return 'stable';
}

/**
 * Compute dynamic confidence score (0.0 - 1.0) based on:
 *   - Data volume (30%): more days of data = higher confidence
 *   - Coefficient of variation (30%): lower variance = higher confidence
 *   - Day-of-week match (20%): having data for same weekday boosts confidence
 *   - Event proximity (20%): being near a known event boosts confidence for event-affected categories
 */
function computeConfidence(
    dailyValues: number[],
    forecastDate: Date,
    hasEventFactor: boolean
): number {
    // 1. Data volume score: 0-30 days mapped to 0.0-1.0
    const volumeScore = Math.min(1.0, dailyValues.length / 21);

    // 2. Coefficient of variation score: low CV = high confidence
    let cvScore = 0.5;
    if (dailyValues.length >= 3) {
        const mean = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
        if (mean > 0) {
            const variance = dailyValues.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / dailyValues.length;
            const cv = Math.sqrt(variance) / mean;
            // CV of 0 => score 1.0, CV of 1.0 => score 0.0
            cvScore = Math.max(0, Math.min(1.0, 1.0 - cv));
        }
    }

    // 3. Day-of-week match: check if we have data for the same weekday
    const targetDay = forecastDate.getDay();
    const hasSameDayData = dailyValues.length >= 7; // at least 1 full week
    const dayScore = hasSameDayData ? 0.9 : 0.4;

    // 4. Event factor: known events make predictions more reliable for event categories
    const eventScore = hasEventFactor ? 0.85 : 0.6;

    // Weighted average
    const confidence = (
        volumeScore * 0.30 +
        cvScore * 0.30 +
        dayScore * 0.20 +
        eventScore * 0.20
    );

    // Clamp to 0.15 - 0.98
    return Math.round(Math.max(0.15, Math.min(0.98, confidence)) * 100) / 100;
}

class ForecastingEngineClass {
    /**
     * Build daily unit totals for a product from real sales data.
     * Returns an array of { date, units } sorted chronologically.
     */
    private buildDailyHistory(
        productId: string,
        sales: SaleRecord[],
        lookbackDays: number = 30
    ): number[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - lookbackDays);
        cutoff.setHours(0, 0, 0, 0);

        // Bucket by day offset from cutoff
        const buckets = new Array(lookbackDays).fill(0);

        for (const sale of sales) {
            const saleDate = new Date(sale.timestamp);
            if (saleDate < cutoff) continue;
            const dayIndex = Math.floor((saleDate.getTime() - cutoff.getTime()) / (24 * 60 * 60 * 1000));
            if (dayIndex < 0 || dayIndex >= lookbackDays) continue;
            for (const item of sale.items) {
                if (item.productId === productId || item.productId === productId.replace('-pack', '')) {
                    buckets[dayIndex] += item.quantity;
                }
            }
        }

        return buckets;
    }

    /**
     * Build daily REVENUE totals from all sales.
     */
    buildDailyRevenue(sales: SaleRecord[], lookbackDays: number = 30): number[] {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - lookbackDays);
        cutoff.setHours(0, 0, 0, 0);

        const buckets = new Array(lookbackDays).fill(0);

        for (const sale of sales) {
            const saleDate = new Date(sale.timestamp);
            if (saleDate < cutoff) continue;
            const dayIndex = Math.floor((saleDate.getTime() - cutoff.getTime()) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < lookbackDays) {
                buckets[dayIndex] += sale.totalAmount;
            }
        }

        return buckets;
    }

    /**
     * Calculate baseline using weighted moving average.
     * More recent data gets higher weight.
     */
    private calculateBaselineForecast(
        productId: string,
        days: number,
        sales?: SaleRecord[]
    ): { baseline: number[]; dailyHistory: number[] } {
        const dailyHistory = (sales && sales.length > 0)
            ? this.buildDailyHistory(productId, sales, 30)
            : this.generateFallbackHistory();

        // Weighted average: recent days get 2x weight
        const weights = dailyHistory.map((_, i) => 1 + (i / dailyHistory.length));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const weightedAvg = dailyHistory.reduce(
            (sum, val, i) => sum + val * weights[i], 0
        ) / totalWeight;

        // Also compute day-of-week averages for seasonality
        const dowBuckets: number[][] = [[], [], [], [], [], [], []];
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - dailyHistory.length);

        dailyHistory.forEach((val, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            dowBuckets[d.getDay()].push(val);
        });

        const dowAvg = dowBuckets.map(bucket =>
            bucket.length > 0 ? bucket.reduce((a, b) => a + b, 0) / bucket.length : weightedAvg
        );

        // Forecast: blend global weighted avg (40%) with day-of-week avg (60%)
        const baseline = Array(days).fill(0).map((_, i) => {
            const forecastDate = new Date(now);
            forecastDate.setDate(forecastDate.getDate() + i);
            const dow = forecastDate.getDay();
            const blended = weightedAvg * 0.4 + dowAvg[dow] * 0.6;
            return Math.max(1, Math.round(blended));
        });

        return { baseline, dailyHistory };
    }

    // Apply Algerian-specific multipliers with dynamic confidence
    private applyAlgerianMultipliers(
        baseForecasts: number[],
        startDate: Date,
        category: string,
        dailyHistory: number[]
    ): ForecastResult[] {
        const overallTrend = detectTrend(dailyHistory);

        return baseForecasts.map((base, index) => {
            const forecastDate = new Date(startDate);
            forecastDate.setDate(forecastDate.getDate() + index);

            let multiplier = 1.0;
            const factors: string[] = [];
            let hasEventFactor = false;

            // Check active calendar events
            const activeEvents = getActiveEvents(forecastDate);
            for (const event of activeEvents) {
                const eventMultiplier = event.demandMultipliers[category] || event.demandMultipliers['default'] || 1.0;
                if (eventMultiplier > 1) {
                    multiplier *= eventMultiplier;
                    factors.push(`${event.nameAr} (+${Math.round((eventMultiplier - 1) * 100)}%)`);
                    hasEventFactor = true;
                }
            }

            // Friday couscous pattern
            if (isFriday(forecastDate)) {
                const fridayMult = FRIDAY_MULTIPLIERS[category] || FRIDAY_MULTIPLIERS['default'];
                if (fridayMult > 1) {
                    multiplier *= fridayMult;
                    factors.push(`Vendredi (+${Math.round((fridayMult - 1) * 100)}%)`);
                }
            }

            // Salary period
            if (isInSalaryPeriod(forecastDate)) {
                const salaryMult = SALARY_PERIOD_MULTIPLIERS[category] || SALARY_PERIOD_MULTIPLIERS['default'];
                if (salaryMult > 1) {
                    multiplier *= salaryMult;
                    factors.push(`Période de salaire (+${Math.round((salaryMult - 1) * 100)}%)`);
                }
            }

            // Apply trend adjustment: rising trend pushes forecast up slightly
            if (overallTrend === 'rising') { multiplier *= 1.05; }
            if (overallTrend === 'falling') { multiplier *= 0.95; }

            const predicted = Math.round(base * multiplier);

            // Dynamic confidence
            const confidence = computeConfidence(dailyHistory, forecastDate, hasEventFactor);

            // Variance based on confidence: low confidence = wider bounds
            const variancePct = 0.30 - (confidence * 0.20); // 10% to 30%
            const variance = predicted * variancePct;

            return {
                date: forecastDate,
                predictedDemand: predicted,
                lowerBound: Math.max(0, Math.round(predicted - variance)),
                upperBound: Math.round(predicted + variance),
                confidence,
                factors,
                trend: overallTrend,
            };
        });
    }

    // Fallback when no real sales data exists
    private generateFallbackHistory(): number[] {
        // Use a deterministic low-noise pattern instead of pure random
        return Array(30).fill(0).map((_, i) => {
            const base = 15;
            const dayOfWeek = (new Date().getDay() - 30 + i + 70) % 7;
            const fridayBoost = dayOfWeek === 5 ? 8 : 0;
            return base + fridayBoost + (i % 3);
        });
    }

    // Public API: Get demand forecast (now accepts real sales data)
    forecastDemand(
        productId: string,
        category: string,
        days: number = 7,
        sales?: SaleRecord[]
    ): ForecastResult[] {
        const { baseline, dailyHistory } = this.calculateBaselineForecast(productId, days, sales);
        return this.applyAlgerianMultipliers(baseline, new Date(), category, dailyHistory);
    }

    /**
     * Generate a 7-day revenue forecast from aggregate sales data.
     * Used by the ReportsHub chart.
     */
    forecastRevenue(sales: SaleRecord[], days: number = 7): {
        forecasts: { day: string; predicted: number; lower: number; upper: number; factors: string[] }[];
        confidence: number;
        trend: TrendDirection;
        peakDay: string;
    } {
        const dailyRevenue = this.buildDailyRevenue(sales, 30);
        const trend = detectTrend(dailyRevenue);

        // Weighted average
        const weights = dailyRevenue.map((_, i) => 1 + (i / dailyRevenue.length));
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const weightedAvg = dailyRevenue.reduce((sum, val, i) => sum + val * weights[i], 0) / totalWeight;

        // Day-of-week seasonality
        const dowBuckets: number[][] = [[], [], [], [], [], [], []];
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - dailyRevenue.length);
        dailyRevenue.forEach((val, i) => {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            dowBuckets[d.getDay()].push(val);
        });
        const dowAvg = dowBuckets.map(bucket =>
            bucket.length > 0 ? bucket.reduce((a, b) => a + b, 0) / bucket.length : weightedAvg
        );

        const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        let maxPredicted = 0;
        let peakDay = 'Ven';

        const forecasts = Array(days).fill(0).map((_, i) => {
            const forecastDate = new Date(now);
            forecastDate.setDate(forecastDate.getDate() + i);
            const dow = forecastDate.getDay();

            let multiplier = 1.0;
            const factors: string[] = [];

            // Blend
            let base = weightedAvg * 0.4 + dowAvg[dow] * 0.6;

            // Trend adjustment
            if (trend === 'rising') { base *= 1.03; }
            if (trend === 'falling') { base *= 0.97; }

            // Calendar events
            const activeEvents = getActiveEvents(forecastDate);
            for (const event of activeEvents) {
                const avgMult = Object.values(event.demandMultipliers).reduce((a, b) => a + b, 0) /
                    Object.values(event.demandMultipliers).length;
                if (avgMult > 1) {
                    multiplier *= avgMult;
                    factors.push(`${event.nameAr || event.name}`);
                }
            }

            if (isFriday(forecastDate)) {
                multiplier *= 1.2;
                factors.push('Vendredi');
            }
            if (isInSalaryPeriod(forecastDate)) {
                multiplier *= 1.12;
                factors.push('Salaire');
            }

            const predicted = Math.round(base * multiplier);
            const confidenceVal = computeConfidence(dailyRevenue, forecastDate, activeEvents.length > 0);
            const variancePct = 0.30 - (confidenceVal * 0.20);

            if (predicted > maxPredicted) {
                maxPredicted = predicted;
                peakDay = dayNames[dow];
            }

            const label = i === 0 ? 'Auj' : i === 1 ? 'Dem' : dayNames[dow];

            return {
                day: label,
                predicted,
                lower: Math.max(0, Math.round(predicted * (1 - variancePct))),
                upper: Math.round(predicted * (1 + variancePct)),
                factors,
            };
        });

        // Average confidence
        const avgConfidence = computeConfidence(
            dailyRevenue,
            now,
            getActiveEvents(now).length > 0
        );

        return {
            forecasts,
            confidence: avgConfidence,
            trend,
            peakDay,
        };
    }

    /** Detect trend from sales data */
    detectRevenueTrend(sales: SaleRecord[], lookbackDays: number = 14): TrendDirection {
        const daily = this.buildDailyRevenue(sales, lookbackDays);
        return detectTrend(daily);
    }

    // Calculate reorder suggestions (now with real data)
    calculateReorderSuggestions(products: {
        id: string;
        name: string;
        category: string;
        currentStock: number;
        reorderPoint: number;
        leadTime: number;
    }[], sales?: SaleRecord[]): ReorderSuggestion[] {
        return products.map(product => {
            const forecast = this.forecastDemand(product.id, product.category, product.leadTime + 7, sales);
            const totalPredicted = forecast.reduce((sum, f) => sum + f.predictedDemand, 0);
            const daysUntilStockout = product.currentStock / (totalPredicted / forecast.length);

            let priority: 'critical' | 'urgent' | 'normal' = 'normal';
            let reason = '';

            if (daysUntilStockout <= 2) {
                priority = 'critical';
                reason = `Rupture de stock prévue dans ${Math.round(daysUntilStockout)} jours`;
            } else if (daysUntilStockout <= 5) {
                priority = 'urgent';
                reason = `Stock faible, ${Math.round(daysUntilStockout)} jours restants`;
            } else if (product.currentStock <= product.reorderPoint) {
                reason = `Stock sous le point de réapprovisionnement`;
            } else {
                reason = `Réapprovisionnement préventif recommandé`;
            }

            // Check for special events
            const upcomingEvents = getActiveEvents(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
            if (upcomingEvents.length > 0) {
                reason += ` • ${upcomingEvents[0].nameAr} approche`;
            }

            const suggestedQuantity = Math.max(
                totalPredicted - product.currentStock + product.reorderPoint,
                product.reorderPoint
            );

            return {
                productId: product.id,
                productName: product.name,
                currentStock: product.currentStock,
                predictedDemand: totalPredicted,
                suggestedQuantity: Math.round(suggestedQuantity),
                priority,
                reason,
            };
        }).filter(s => s.priority === 'critical' || s.priority === 'urgent' || s.currentStock <= s.predictedDemand * 0.5)
            .sort((a, b) => {
                const priorityOrder = { critical: 0, urgent: 1, normal: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
    }
}

// ===== ANOMALY DETECTION =====

class AnomalyDetectorClass {
    detectAnomalies(salesData: { date: Date; amount: number }[]): AnomalyResult[] {
        const anomalies: AnomalyResult[] = [];

        if (salesData.length < 7) return anomalies;

        // Calculate moving average and standard deviation
        const amounts = salesData.map(d => d.amount);
        const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const std = Math.sqrt(amounts.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / amounts.length);

        // Detect spikes and drops
        const lastValue = amounts[amounts.length - 1];
        const previousAvg = amounts.slice(-7, -1).reduce((a, b) => a + b, 0) / 6;

        if (lastValue > avg + 2 * std) {
            anomalies.push({
                type: 'spike',
                severity: lastValue > avg + 3 * std ? 'high' : 'medium',
                message: `Pic de ventes inhabituel: +${Math.round((lastValue / previousAvg - 1) * 100)}% par rapport à la moyenne`,
                affectedProducts: [],
                suggestedAction: 'Vérifier les stocks des produits les plus vendus',
            });
        }

        if (lastValue < avg - 2 * std) {
            anomalies.push({
                type: 'drop',
                severity: lastValue < avg - 3 * std ? 'high' : 'medium',
                message: `Baisse de ventes inhabituelle: ${Math.round((1 - lastValue / previousAvg) * 100)}% en dessous de la moyenne`,
                affectedProducts: [],
                suggestedAction: 'Analyser les facteurs externes (météo, concurrence, événements)',
            });
        }

        return anomalies;
    }
}

// ===== INSIGHTS GENERATOR =====

class InsightsGeneratorClass {
    private forecaster = new ForecastingEngineClass();
    private anomalyDetector = new AnomalyDetectorClass();

    generateDailyInsights(): AIInsight[] {
        const insights: AIInsight[] = [];
        const today = new Date();

        // Upcoming events
        const events = getAlgerianCalendarEvents(today.getFullYear());
        const upcomingEvents = events.filter(e => {
            const daysUntil = Math.floor((e.startDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
            return daysUntil > 0 && daysUntil <= 14;
        });

        for (const event of upcomingEvents) {
            const daysUntil = Math.floor((event.startDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
            const topCategories = Object.entries(event.demandMultipliers)
                .filter(([k, v]) => k !== 'default' && v > 1.3)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            insights.push({
                id: `event-${event.name}-${daysUntil}`,
                type: 'forecast',
                title: `${event.nameAr} dans ${daysUntil} jours`,
                description: `Préparez vos stocks: ${topCategories.map(([cat, mult]) =>
                    `${cat} (+${Math.round((mult - 1) * 100)}%)`
                ).join(', ')}`,
                importance: daysUntil <= 7 ? 'high' : 'medium',
                icon: '📅',
                actionLabel: 'Voir suggestions',
                timestamp: today,
            });
        }

        // Friday reminder
        if (today.getDay() === 4) { // Thursday
            insights.push({
                id: 'friday-prep',
                type: 'recommendation',
                title: 'Préparation Vendredi',
                description: 'Demain vendredi: prévoyez +150% sur couscous, légumes et viande',
                importance: 'medium',
                icon: '🍲',
                timestamp: today,
            });
        }

        // Salary period
        if (isInSalaryPeriod(today)) {
            insights.push({
                id: 'salary-period',
                type: 'opportunity',
                title: 'Période de salaire active',
                description: 'Les clients ont plus de pouvoir d\'achat. Mettez en avant les promotions et packs.',
                importance: 'medium',
                icon: '💰',
                timestamp: today,
            });
        }

        // Note: Real expiry alerts are handled by ExpiryAlertService in the Dashboard
        // This generator only provides calendar-based and timing insights

        return insights.sort((a, b) => {
            const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return importanceOrder[a.importance] - importanceOrder[b.importance];
        });
    }

    getForecastSummary(days: number = 7): {
        totalPredictedRevenue: number;
        growthPercent: number;
        topGrowthCategories: { category: string; growth: number }[];
        riskFactors: string[];
    } {
        // Returns empty/zero data when there's no real historical data
        // In production with real data, this would aggregate from actual sales history
        return {
            totalPredictedRevenue: 0,
            growthPercent: 0,
            topGrowthCategories: [],
            riskFactors: getActiveEvents(new Date()).length > 0
                ? ['Période de forte demande - surveiller les stocks']
                : [],
        };
    }
}

// Export singletons
export const ForecastingEngine = new ForecastingEngineClass();
export const AnomalyDetector = new AnomalyDetectorClass();
export const InsightsGenerator = new InsightsGeneratorClass();

export {
    getAlgerianCalendarEvents,
    getActiveEvents,
    isInSalaryPeriod,
    isFriday,
    RAMADAN_MULTIPLIERS,
    FRIDAY_MULTIPLIERS,
};
