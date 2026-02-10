const RAMADAN_MULTIPLIERS = {
  "dates": 4.2,
  "milk": 2.1,
  "eggs": 1.8,
  "cheese": 1.6,
  "bread": 1.5,
  "beverages": 2.3,
  "meat": 1.9,
  "vegetables": 1.7,
  "fruits": 1.8,
  "sweets": 2.5,
  "oil": 1.4,
  "flour": 1.6,
  "default": 1.3
};
const FRIDAY_MULTIPLIERS = {
  "couscous": 2.5,
  "vegetables": 1.8,
  "meat": 1.6,
  "chickpeas": 1.9,
  "raisins": 1.5,
  "default": 1.1
};
const SALARY_PERIOD_MULTIPLIERS = {
  "electronics": 1.4,
  "cleaning": 1.3,
  "beverages": 1.2,
  "snacks": 1.3,
  "default": 1.15
};
function getAlgerianCalendarEvents(year) {
  return [
    // Ramadan 2024 (approximate)
    {
      name: "Ramadan",
      nameAr: "رمضان",
      startDate: new Date(year, 2, 10),
      // March 10
      endDate: new Date(year, 3, 9),
      // April 9
      type: "religious",
      demandMultipliers: RAMADAN_MULTIPLIERS
    },
    // Eid el-Fitr
    {
      name: "Eid el-Fitr",
      nameAr: "عيد الفطر",
      startDate: new Date(year, 3, 10),
      // April 10
      endDate: new Date(year, 3, 12),
      type: "religious",
      demandMultipliers: { sweets: 3, clothes: 2.5, gifts: 2, default: 1.5 }
    },
    // Eid el-Adha
    {
      name: "Eid el-Adha",
      nameAr: "عيد الأضحى",
      startDate: new Date(year, 5, 16),
      // June 16 (approximate)
      endDate: new Date(year, 5, 19),
      type: "religious",
      demandMultipliers: { meat: 3.5, spices: 2, charcoal: 2.5, default: 1.4 }
    },
    // Date Harvest
    {
      name: "Date Harvest Season",
      nameAr: "موسم جني التمور",
      startDate: new Date(year, 8, 1),
      // September
      endDate: new Date(year, 10, 30),
      // November
      type: "seasonal",
      demandMultipliers: { dates: 0.8, default: 1 }
      // Lower prices = different demand
    },
    // Olive Harvest
    {
      name: "Olive Harvest",
      nameAr: "موسم الزيتون",
      startDate: new Date(year, 9, 15),
      // October
      endDate: new Date(year, 11, 15),
      // December
      type: "seasonal",
      demandMultipliers: { oil: 0.85, olives: 0.9, default: 1 }
    },
    // Back to School
    {
      name: "Back to School",
      nameAr: "الدخول المدرسي",
      startDate: new Date(year, 8, 1),
      // September 1
      endDate: new Date(year, 8, 15),
      type: "economic",
      demandMultipliers: { stationery: 3, bags: 2.5, snacks: 1.5, default: 1.2 }
    }
  ];
}
function isInSalaryPeriod(date) {
  const day = date.getDate();
  return day >= 25 || day <= 5;
}
function isFriday(date) {
  return date.getDay() === 5;
}
function getActiveEvents(date) {
  const events = getAlgerianCalendarEvents(date.getFullYear());
  return events.filter((event) => {
    const start = event.startDate;
    const end = event.endDate || event.startDate;
    return date >= start && date <= end;
  });
}
class ForecastingEngineClass {
  historicalData = /* @__PURE__ */ new Map();
  // Simple moving average with seasonality
  calculateBaselineForecast(productId, days) {
    const history = this.historicalData.get(productId) || this.generateMockHistory();
    const avgDaily = history.reduce((a, b) => a + b, 0) / history.length;
    return Array(days).fill(0).map(() => {
      const variation = 0.9 + Math.random() * 0.2;
      return Math.round(avgDaily * variation);
    });
  }
  // Apply Algerian-specific multipliers
  applyAlgerianMultipliers(baseForecasts, startDate, category) {
    return baseForecasts.map((base, index) => {
      const forecastDate = new Date(startDate);
      forecastDate.setDate(forecastDate.getDate() + index);
      let multiplier = 1;
      const factors = [];
      const activeEvents = getActiveEvents(forecastDate);
      for (const event of activeEvents) {
        const eventMultiplier = event.demandMultipliers[category] || event.demandMultipliers["default"] || 1;
        if (eventMultiplier > 1) {
          multiplier *= eventMultiplier;
          factors.push(`${event.nameAr} (+${Math.round((eventMultiplier - 1) * 100)}%)`);
        }
      }
      if (isFriday(forecastDate)) {
        const fridayMult = FRIDAY_MULTIPLIERS[category] || FRIDAY_MULTIPLIERS["default"];
        if (fridayMult > 1) {
          multiplier *= fridayMult;
          factors.push(`Vendredi (+${Math.round((fridayMult - 1) * 100)}%)`);
        }
      }
      if (isInSalaryPeriod(forecastDate)) {
        const salaryMult = SALARY_PERIOD_MULTIPLIERS[category] || SALARY_PERIOD_MULTIPLIERS["default"];
        if (salaryMult > 1) {
          multiplier *= salaryMult;
          factors.push(`Période de salaire (+${Math.round((salaryMult - 1) * 100)}%)`);
        }
      }
      const predicted = Math.round(base * multiplier);
      const variance = predicted * 0.15;
      return {
        date: forecastDate,
        predictedDemand: predicted,
        lowerBound: Math.round(predicted - variance),
        upperBound: Math.round(predicted + variance),
        confidence: factors.length > 0 ? 0.85 : 0.92,
        factors
      };
    });
  }
  // Generate mock historical data
  generateMockHistory() {
    return Array(30).fill(0).map(() => Math.floor(10 + Math.random() * 50));
  }
  // Public API: Get demand forecast
  forecastDemand(productId, category, days = 7) {
    const baseline = this.calculateBaselineForecast(productId, days);
    return this.applyAlgerianMultipliers(baseline, /* @__PURE__ */ new Date(), category);
  }
  // Calculate reorder suggestions
  calculateReorderSuggestions(products) {
    return products.map((product) => {
      const forecast = this.forecastDemand(product.id, product.category, product.leadTime + 7);
      const totalPredicted = forecast.reduce((sum, f) => sum + f.predictedDemand, 0);
      const daysUntilStockout = product.currentStock / (totalPredicted / forecast.length);
      let priority = "normal";
      let reason = "";
      if (daysUntilStockout <= 2) {
        priority = "critical";
        reason = `Rupture de stock prévue dans ${Math.round(daysUntilStockout)} jours`;
      } else if (daysUntilStockout <= 5) {
        priority = "urgent";
        reason = `Stock faible, ${Math.round(daysUntilStockout)} jours restants`;
      } else if (product.currentStock <= product.reorderPoint) {
        reason = `Stock sous le point de réapprovisionnement`;
      } else {
        reason = `Réapprovisionnement préventif recommandé`;
      }
      const upcomingEvents = getActiveEvents(new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3));
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
        reason
      };
    }).filter((s) => s.priority === "critical" || s.priority === "urgent" || s.currentStock <= s.predictedDemand * 0.5).sort((a, b) => {
      const priorityOrder = { critical: 0, urgent: 1, normal: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}
class AnomalyDetectorClass {
  detectAnomalies(salesData) {
    const anomalies = [];
    if (salesData.length < 7) return anomalies;
    const amounts = salesData.map((d) => d.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const std = Math.sqrt(amounts.reduce((sum, x) => sum + Math.pow(x - avg, 2), 0) / amounts.length);
    const lastValue = amounts[amounts.length - 1];
    const previousAvg = amounts.slice(-7, -1).reduce((a, b) => a + b, 0) / 6;
    if (lastValue > avg + 2 * std) {
      anomalies.push({
        type: "spike",
        severity: lastValue > avg + 3 * std ? "high" : "medium",
        message: `Pic de ventes inhabituel: +${Math.round((lastValue / previousAvg - 1) * 100)}% par rapport à la moyenne`,
        affectedProducts: [],
        suggestedAction: "Vérifier les stocks des produits les plus vendus"
      });
    }
    if (lastValue < avg - 2 * std) {
      anomalies.push({
        type: "drop",
        severity: lastValue < avg - 3 * std ? "high" : "medium",
        message: `Baisse de ventes inhabituelle: ${Math.round((1 - lastValue / previousAvg) * 100)}% en dessous de la moyenne`,
        affectedProducts: [],
        suggestedAction: "Analyser les facteurs externes (météo, concurrence, événements)"
      });
    }
    return anomalies;
  }
}
class InsightsGeneratorClass {
  forecaster = new ForecastingEngineClass();
  anomalyDetector = new AnomalyDetectorClass();
  generateDailyInsights() {
    const insights = [];
    const today = /* @__PURE__ */ new Date();
    const events = getAlgerianCalendarEvents(today.getFullYear());
    const upcomingEvents = events.filter((e) => {
      const daysUntil = Math.floor((e.startDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1e3));
      return daysUntil > 0 && daysUntil <= 14;
    });
    for (const event of upcomingEvents) {
      const daysUntil = Math.floor((event.startDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1e3));
      const topCategories = Object.entries(event.demandMultipliers).filter(([k, v]) => k !== "default" && v > 1.3).sort((a, b) => b[1] - a[1]).slice(0, 3);
      insights.push({
        id: `event-${event.name}-${daysUntil}`,
        type: "forecast",
        title: `${event.nameAr} dans ${daysUntil} jours`,
        description: `Préparez vos stocks: ${topCategories.map(
          ([cat, mult]) => `${cat} (+${Math.round((mult - 1) * 100)}%)`
        ).join(", ")}`,
        importance: daysUntil <= 7 ? "high" : "medium",
        icon: "📅",
        actionLabel: "Voir suggestions",
        timestamp: today
      });
    }
    if (today.getDay() === 4) {
      insights.push({
        id: "friday-prep",
        type: "recommendation",
        title: "Préparation Vendredi",
        description: "Demain vendredi: prévoyez +150% sur couscous, légumes et viande",
        importance: "medium",
        icon: "🍲",
        timestamp: today
      });
    }
    if (isInSalaryPeriod(today)) {
      insights.push({
        id: "salary-period",
        type: "opportunity",
        title: "Période de salaire active",
        description: "Les clients ont plus de pouvoir d'achat. Mettez en avant les promotions et packs.",
        importance: "medium",
        icon: "💰",
        timestamp: today
      });
    }
    return insights.sort((a, b) => {
      const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return importanceOrder[a.importance] - importanceOrder[b.importance];
    });
  }
  getForecastSummary(days = 7) {
    return {
      totalPredictedRevenue: 0,
      growthPercent: 0,
      topGrowthCategories: [],
      riskFactors: getActiveEvents(/* @__PURE__ */ new Date()).length > 0 ? ["Période de forte demande - surveiller les stocks"] : []
    };
  }
}
const InsightsGenerator = new InsightsGeneratorClass();
export {
  InsightsGenerator as I,
  getAlgerianCalendarEvents as g
};
