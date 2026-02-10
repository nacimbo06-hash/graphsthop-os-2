/**
 * SKU Generator Algorithm
 * Generates unique SKU from barcode with intelligent length determination
 */

export interface SKUValidationResult {
    sku: string;
    length: 3 | 4 | 5;
    isUnique: boolean;
    attempts: number;
}



/**
 * Generate SKU from barcode
 * Algorithm:
 * 1. Try 3 digits first (most compact)
 * 2. If collision, try 4 digits
 * 3. If still collision, try 5 digits
 * 4. If all collide, append counter
 */
export const generateSKU = (
    _barcode: string, // Barcode is no longer used for SKU generation to avoid collisions
    existingSKUs: string[]
): SKUValidationResult => {
    // Filter existing SKUs to find only numeric ones
    const numericSKUs = existingSKUs
        .filter(s => /^\d+$/.test(s))
        .map(s => parseInt(s, 10))
        .sort((a, b) => a - b);

    // Start at 1000 if no SKUs exist
    let nextSKU = 1000;

    if (numericSKUs.length > 0) {
        // Find the first gap or increment the max
        const maxSKU = numericSKUs[numericSKUs.length - 1];
        nextSKU = maxSKU + 1;

        // Optional: Fill gaps if needed, but appending to end is safer/simpler
    }

    const skuString = nextSKU.toString();

    return {
        sku: skuString,
        length: skuString.length as 3 | 4 | 5,
        isUnique: true,
        attempts: 1
    };
};

/**
 * Validate SKU format
 */
export const validateSKU = (sku: string): boolean => {
    return /^\d{3,6}$/.test(sku);
};

/**
 * Check if SKU exists in database
 */
export const checkSKUExists = (sku: string, existingSKUs: string[]): boolean => {
    return existingSKUs.map(s => s.toUpperCase()).includes(sku.toUpperCase());
};

/**
 * Standard abbreviations table for ticket printing
 * Used to shorten long designations for thermal receipts (max ~30 chars)
 */
const ABBREVIATIONS: Record<string, string> = {
    // Nature
    'chocolat': 'Choco',
    'fraise': 'Frs',
    'vanille': 'Van',
    'nature': 'Nat',
    'tomate': 'Tom',
    'végétal': 'Végé',
    'brassé': 'Bras.',
    'demi-écrémé': 'D-Ecr',
    'demi-ecrémé': 'D-Ecr',
    'entier': 'Ent',
    'écrémé': 'Ecr',
    'concentré': 'Conc.',
    'double concentré': 'Dbl Conc.',
    // Packaging
    'bouteille': 'Blle',
    'canette': 'Can',
    'sachet': 'Sach',
    'carton': 'Crt',
    'pack': 'Pk',
    'pièce': 'Pce',
    'unité': 'Uté',
    // Common words
    'arôme': 'Ar.',
    'parfum': 'Parf.',
    'saveur': 'Sav.',
    'aux': '',
    'à la': '',
    'de': '',
    // Brands (shorten long ones)
    'la vache qui rit': 'LVQR',
    'hamoud boualem': 'H.BOUALEM',
    'amor benamor': 'ABA',
    'el mordjane': 'MORDJ.',
    'la belle': 'L.BELLE',
    'palmary': 'PALM.',
    'soummam': 'SOUM.',
    'ifri': 'IFRI',
    'toudja': 'TOUD.',
    'rouiba': 'ROUI.',
    'ngaous': 'NGAO.',
};

/**
 * Apply abbreviations to text for ticket printing
 */
const abbreviate = (text: string): string => {
    let result = text;
    for (const [long, short] of Object.entries(ABBREVIATIONS)) {
        const regex = new RegExp(long, 'gi');
        result = result.replace(regex, short);
    }
    // Clean up extra spaces
    return result.replace(/\s+/g, ' ').trim();
};

/**
 * Generate designation from product info
 * Golden Formula: MARQUE + NATURE + VARIÉTÉ + QUANTITÉ
 */
export const generateDesignation = (
    brand: string,
    nature: string,
    variety: string,
    quantity: string,
    unit: string
): string => {
    const parts: string[] = [];

    // 1. BRAND (always uppercase)
    if (brand) {
        parts.push(brand.toUpperCase());
    }

    // 2. NATURE (Title Case)
    if (nature) {
        const formattedNature = nature
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        parts.push(formattedNature);
    }

    // 3. VARIETY (Title Case, if different from nature)
    if (variety && variety.toLowerCase() !== nature.toLowerCase()) {
        const formattedVariety = variety
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        parts.push(formattedVariety);
    }

    // 4. QUANTITY + UNIT (compact)
    if (quantity && unit) {
        parts.push(`${quantity}${unit}`);
    }

    return parts.join(' ');
};

/**
 * Generate short name for ticket de caisse (max ~30 characters)
 * Applies abbreviations and truncation
 */
export const generateShortName = (
    brand: string,
    nature: string,
    variety: string,
    quantity: string,
    unit: string,
    maxLength: number = 30
): string => {
    // Build full name first
    let shortName = generateDesignation(brand, nature, variety, quantity, unit);

    // Apply abbreviations
    shortName = abbreviate(shortName);

    // If still too long, truncate intelligently
    if (shortName.length > maxLength) {
        // Try removing variety first
        shortName = abbreviate(generateDesignation(brand, nature, '', quantity, unit));
    }

    // Hard truncate if needed
    if (shortName.length > maxLength) {
        shortName = shortName.substring(0, maxLength - 1) + '.';
    }

    return shortName;
};

/**
 * Validate price - ensure sell price > buy price
 */
export const validatePrices = (
    buyPrice: number,
    sellPrice: number
): { isValid: boolean; margin: number; warning?: string } => {
    if (sellPrice <= buyPrice) {
        return {
            isValid: false,
            margin: 0,
            warning: `⚠️ Prix de vente (${sellPrice} DA) est inférieur ou égal au prix d'achat (${buyPrice} DA)!`
        };
    }

    const margin = ((sellPrice - buyPrice) / buyPrice) * 100;

    if (margin < 5) {
        return {
            isValid: true,
            margin,
            warning: `⚠️ Marge très faible: ${margin.toFixed(1)}%`
        };
    }

    return { isValid: true, margin };
};
