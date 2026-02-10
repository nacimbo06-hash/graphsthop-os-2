/**
 * Product Data Types and Constants
 * Optimized for Algerian Supermarket Context
 * Based on: Optimisation Dataset Supermarché Algérien Mobile
 */

/**
 * Units of Measure - Optimized for Algerian Supermarket
 * Organized by category for better UX in dropdowns
 * 
 * Categories:
 * - BASE: Standard countable units
 * - WEIGHT: Solid products (semoule, sucre, légumes secs, viandes)
 * - VOLUME: Liquid products (huile, lait, eau, javel)
 * - PACKAGING: Container types for inventory management
 */

// Unit categories for grouped display
export type UnitCategory = 'base' | 'weight' | 'volume' | 'packaging';

export interface UnitOfMeasure {
    value: string;
    label: string;
    symbol: string;
    category: UnitCategory;
    baseUnit?: string;      // Reference unit for conversion (kg for weight, L for volume)
    conversionFactor?: number;  // Multiply by this to get base unit
    allowDecimals?: boolean;    // Whether decimal quantities are allowed
    increment?: number;         // Suggested increment for bulk products (e.g., 0.1 for 100g)
}

export const UNITS_OF_MEASURE: UnitOfMeasure[] = [
    // ═══════════════════════════════════════════════════════════════
    // BASE UNITS - Countable items
    // ═══════════════════════════════════════════════════════════════
    {
        value: 'unit',
        label: 'Unité',
        symbol: 'u',
        category: 'base',
        allowDecimals: false
    },
    {
        value: 'piece',
        label: 'Pièce',
        symbol: 'pce',
        category: 'base',
        allowDecimals: false
    },
    {
        value: 'dozen',
        label: 'Douzaine (12)',
        symbol: 'dz',
        category: 'base',
        allowDecimals: false
    },
    {
        value: 'lot',
        label: 'Lot',
        symbol: 'lot',
        category: 'base',
        allowDecimals: false
    },

    // ═══════════════════════════════════════════════════════════════
    // WEIGHT UNITS - Solid products (semoule, sucre, viandes, etc.)
    // ═══════════════════════════════════════════════════════════════
    {
        value: 'kg',
        label: 'Kilogramme',
        symbol: 'Kg',
        category: 'weight',
        baseUnit: 'kg',
        conversionFactor: 1,
        allowDecimals: true,
        increment: 0.5  // Increment by 500g
    },
    {
        value: 'g',
        label: 'Gramme',
        symbol: 'g',
        category: 'weight',
        baseUnit: 'kg',
        conversionFactor: 0.001,
        allowDecimals: false
    },
    {
        value: 'g100',
        label: '100 Grammes',
        symbol: '100g',
        category: 'weight',
        baseUnit: 'kg',
        conversionFactor: 0.1,
        allowDecimals: false,
        increment: 1  // Commonly used for vrac pricing (price per 100g)
    },
    {
        value: 'g250',
        label: '250 Grammes',
        symbol: '250g',
        category: 'weight',
        baseUnit: 'kg',
        conversionFactor: 0.25,
        allowDecimals: false
    },
    {
        value: 'g500',
        label: '500 Grammes',
        symbol: '500g',
        category: 'weight',
        baseUnit: 'kg',
        conversionFactor: 0.5,
        allowDecimals: false
    },

    // ═══════════════════════════════════════════════════════════════
    // VOLUME UNITS - Liquid products (huile, lait, eau, javel, etc.)
    // ═══════════════════════════════════════════════════════════════
    {
        value: 'l',
        label: 'Litre',
        symbol: 'L',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 1,
        allowDecimals: true
    },
    {
        value: 'ml',
        label: 'Millilitre',
        symbol: 'ml',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 0.001,
        allowDecimals: false
    },
    {
        value: 'cl',
        label: 'Centilitre',
        symbol: 'cl',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 0.01,
        allowDecimals: false
    },
    {
        value: 'l05',
        label: '0.5 Litre',
        symbol: '50cl',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 0.5,
        allowDecimals: false
    },
    {
        value: 'l1',
        label: '1 Litre',
        symbol: '1L',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 1,
        allowDecimals: false
    },
    {
        value: 'l15',
        label: '1.5 Litre',
        symbol: '1.5L',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 1.5,
        allowDecimals: false
    },
    {
        value: 'l2',
        label: '2 Litres',
        symbol: '2L',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 2,
        allowDecimals: false
    },
    {
        value: 'l5',
        label: '5 Litres (Bidon)',
        symbol: '5L',
        category: 'volume',
        baseUnit: 'l',
        conversionFactor: 5,
        allowDecimals: false
    },

    // ═══════════════════════════════════════════════════════════════
    // PACKAGING UNITS - Container types for inventory
    // ═══════════════════════════════════════════════════════════════
    {
        value: 'pack',
        label: 'Pack',
        symbol: 'Pk',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'carton',
        label: 'Carton',
        symbol: 'Crt',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'box',
        label: 'Boîte',
        symbol: 'Bte',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'sachet',
        label: 'Sachet',
        symbol: 'Sac',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'bottle',
        label: 'Bouteille',
        symbol: 'Btl',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'can',
        label: 'Canette (33cl)',
        symbol: 'Can',
        category: 'packaging',
        baseUnit: 'l',
        conversionFactor: 0.33,
        allowDecimals: false
    },
    {
        value: 'jar',
        label: 'Bocal',
        symbol: 'Boc',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'tube',
        label: 'Tube',
        symbol: 'Tube',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'roll',
        label: 'Rouleau',
        symbol: 'Rl',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'tray',
        label: 'Plateau (Œufs)',
        symbol: 'Plt',
        category: 'packaging',
        allowDecimals: false
    },
    {
        value: 'bag',
        label: 'Sac (25/50Kg)',
        symbol: 'Sac',
        category: 'packaging',
        allowDecimals: false
    },
];

/**
 * Get units grouped by category for organized display
 */
export const getUnitsByCategory = () => {
    return {
        base: UNITS_OF_MEASURE.filter(u => u.category === 'base'),
        weight: UNITS_OF_MEASURE.filter(u => u.category === 'weight'),
        volume: UNITS_OF_MEASURE.filter(u => u.category === 'volume'),
        packaging: UNITS_OF_MEASURE.filter(u => u.category === 'packaging'),
    };
};

/**
 * Get unit label with category prefix for grouped dropdowns
 */
export const getGroupedUnits = () => [
    { label: '── Unités de Base ──', options: UNITS_OF_MEASURE.filter(u => u.category === 'base') },
    { label: '── Poids (Solides) ──', options: UNITS_OF_MEASURE.filter(u => u.category === 'weight') },
    { label: '── Volume (Liquides) ──', options: UNITS_OF_MEASURE.filter(u => u.category === 'volume') },
    { label: '── Conditionnement ──', options: UNITS_OF_MEASURE.filter(u => u.category === 'packaging') },
];

/**
 * Convert quantity to base unit (kg or L)
 */
export const convertToBaseUnit = (quantity: number, unitValue: string): { value: number; unit: string } => {
    const unit = UNITS_OF_MEASURE.find(u => u.value === unitValue);
    if (!unit || !unit.baseUnit || !unit.conversionFactor) {
        return { value: quantity, unit: unitValue };
    }
    return {
        value: quantity * unit.conversionFactor,
        unit: unit.baseUnit
    };
};

/**
 * Product Categories - Algerian Market Taxonomy
 * Structure: Département > Catégorie > Sous-catégorie
 * Based on Jumia Algérie, Carrefour, and local consumption patterns
 */
export const CATEGORIES = [
    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: ÉPICERIE SUCRÉE (Sweet Grocery)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'sweet-grocery',
        name: 'Épicerie Sucrée',
        icon: '🍯',
        color: '#C8956C',
        subcategories: [
            { id: 'biscuits-dry', name: 'Biscuits Secs & Galettes' },
            { id: 'wafers', name: 'Gaufrettes & Cigares' },
            { id: 'cakes-madeleine', name: 'Cakes & Madeleines' },
            { id: 'chocolate-bars', name: 'Tablettes de Chocolat' },
            { id: 'candies', name: 'Bonbons & Sucettes' },
            { id: 'spreads', name: 'Pâtes à Tartiner' },
            { id: 'jams-honey', name: 'Confitures & Miel' },
            { id: 'cereals', name: 'Céréales & Flocons' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: ÉPICERIE SALÉE (Savory Grocery)
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'savory-grocery',
        name: 'Épicerie Salée',
        icon: '🛒',
        color: '#5A9A6B',
        subcategories: [
            { id: 'pasta-short', name: 'Pâtes Courtes (Macaroni, Coude)' },
            { id: 'pasta-long', name: 'Pâtes Longues (Spaghetti)' },
            { id: 'pasta-traditional', name: 'Pâtes Traditionnelles (Rechta, Tlitli, Trida)' },
            { id: 'couscous-semolina', name: 'Couscous & Semoule' },
            { id: 'rice', name: 'Riz' },
            { id: 'legumes', name: 'Légumes Secs (Pois Chiche, Lentilles)' },
            { id: 'oil-table', name: 'Huiles de Table' },
            { id: 'oil-olive', name: 'Huiles d\'Olive' },
            { id: 'sauce-condiments', name: 'Sauces & Condiments' },
            { id: 'spices', name: 'Épices & Herbes' },
            { id: 'smen-fats', name: 'Smen & Matières Grasses' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: CONSERVES & AIDES CULINAIRES
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'canned-goods',
        name: 'Conserves',
        icon: '🥫',
        color: '#C75B3F',
        subcategories: [
            { id: 'tuna-sardines', name: 'Thon & Sardines' },
            { id: 'tomato-paste', name: 'Concentré de Tomate' },
            { id: 'vegetables-canned', name: 'Légumes en Conserve' },
            { id: 'olives-pickles', name: 'Olives & Cornichons' },
            { id: 'ready-meals', name: 'Plats Préparés' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: BOISSONS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'beverages',
        name: 'Boissons',
        icon: '🥤',
        color: '#4A7B8C',
        subcategories: [
            { id: 'gazouz', name: 'Boissons Gazeuses (Gazouz)' },
            { id: 'juices', name: 'Jus de Fruits' },
            { id: 'water-mineral', name: 'Eaux Minérales' },
            { id: 'water-sparkling', name: 'Eaux Gazeuses' },
            { id: 'energy-drinks', name: 'Boissons Énergisantes' },
            { id: 'syrups', name: 'Sirops & Concentrés' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: CAFÉ & THÉ
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'coffee-tea',
        name: 'Café & Thé',
        icon: '☕',
        color: '#6B5344',
        subcategories: [
            { id: 'coffee-ground', name: 'Café Moulu' },
            { id: 'coffee-beans', name: 'Café en Grains' },
            { id: 'coffee-instant', name: 'Café Soluble' },
            { id: 'tea-green', name: 'Thé Vert' },
            { id: 'tea-black', name: 'Thé Noir' },
            { id: 'herbal-infusions', name: 'Infusions & Tisanes' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: PRODUITS FRAIS & CRÈMERIE
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'dairy-fresh',
        name: 'Produits Laitiers',
        icon: '🥛',
        color: '#7B6B8A',
        subcategories: [
            { id: 'milk-uht', name: 'Lait UHT' },
            { id: 'milk-sachet', name: 'Lait Sachet (Subventionné)' },
            { id: 'lben-raib', name: 'L\'ben & Raïb' },
            { id: 'yogurt', name: 'Yaourts & Desserts' },
            { id: 'cream', name: 'Crème Fraîche' },
            { id: 'butter-margarine', name: 'Beurre & Margarine' },
        ]
    },
    {
        id: 'cheese',
        name: 'Fromagerie',
        icon: '🧀',
        color: '#D4A84B',
        subcategories: [
            { id: 'cheese-portions', name: 'Fromages Portions (Triangles)' },
            { id: 'cheese-spread', name: 'Fromages à Tartiner' },
            { id: 'cheese-red', name: 'Fromages Rouges (Edam, Gouda)' },
            { id: 'cheese-grated', name: 'Fromages Râpés' },
            { id: 'cheese-local', name: 'Fromages Locaux' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: BOUCHERIE & CHARCUTERIE
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'meat-butchery',
        name: 'Boucherie',
        icon: '🥩',
        color: '#B55A4A',
        subcategories: [
            { id: 'beef', name: 'Bœuf' },
            { id: 'mutton-lamb', name: 'Mouton & Agneau' },
            { id: 'poultry', name: 'Volaille (Poulet, Dinde)' },
            { id: 'minced-meat', name: 'Viandes Hachées' },
        ]
    },
    {
        id: 'charcuterie',
        name: 'Charcuterie',
        icon: '🍖',
        color: '#8B4F42',
        subcategories: [
            { id: 'cachir', name: 'Cachir' },
            { id: 'pate', name: 'Pâté & Rillettes' },
            { id: 'sausages', name: 'Saucisses & Merguez' },
            { id: 'cold-cuts', name: 'Tranches (Jambon Dinde)' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: FRUITS & LÉGUMES
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'fruits-vegetables',
        name: 'Fruits & Légumes',
        icon: '🍎',
        color: '#3D7C4F',
        subcategories: [
            { id: 'fruits-fresh', name: 'Fruits Frais' },
            { id: 'vegetables-fresh', name: 'Légumes Frais' },
            { id: 'herbs-aromatic', name: 'Herbes Aromatiques' },
            { id: 'dates', name: 'Dattes' },
            { id: 'dried-fruits', name: 'Fruits Secs' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: BOULANGERIE & PÂTISSERIE
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'bakery',
        name: 'Boulangerie',
        icon: '🥖',
        color: '#8B7355',
        subcategories: [
            { id: 'bread-traditional', name: 'Pain Traditionnel (Khobz)' },
            { id: 'bread-baguette', name: 'Baguettes & Pains Spéciaux' },
            { id: 'pastry', name: 'Viennoiseries' },
            { id: 'cakes-fresh', name: 'Gâteaux Frais' },
            { id: 'traditional-pastry', name: 'Pâtisseries Traditionnelles' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: SURGÉLÉS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'frozen',
        name: 'Surgélés',
        icon: '🧊',
        color: '#5B8FA8',
        subcategories: [
            { id: 'frozen-meat', name: 'Viandes Surgelées' },
            { id: 'frozen-fish', name: 'Poissons & Fruits de Mer' },
            { id: 'frozen-vegetables', name: 'Légumes Surgelés' },
            { id: 'ice-cream', name: 'Glaces & Sorbets' },
            { id: 'frozen-ready', name: 'Plats Préparés Surgelés' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: HYGIÈNE & BEAUTÉ
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'hygiene-beauty',
        name: 'Hygiène & Beauté',
        icon: '🧴',
        color: '#B07388',
        subcategories: [
            { id: 'shower-soap', name: 'Douche & Savon' },
            { id: 'hair-care', name: 'Soins Capillaires' },
            { id: 'oral-care', name: 'Hygiène Bucco-Dentaire' },
            { id: 'deodorants', name: 'Déodorants' },
            { id: 'feminine-hygiene', name: 'Hygiène Féminine' },
            { id: 'shaving', name: 'Rasage' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: UNIVERS BÉBÉ
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'baby',
        name: 'Univers Bébé',
        icon: '👶',
        color: '#C4899E',
        subcategories: [
            { id: 'diapers', name: 'Couches' },
            { id: 'baby-food', name: 'Alimentation Bébé' },
            { id: 'baby-milk', name: 'Laits Infantiles' },
            { id: 'baby-care', name: 'Soins Bébé' },
            { id: 'baby-accessories', name: 'Accessoires Bébé' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: ENTRETIEN & MAISON
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'cleaning',
        name: 'Entretien Maison',
        icon: '🧹',
        color: '#5A9A6B',
        subcategories: [
            { id: 'laundry-machine', name: 'Lessive Machine' },
            { id: 'laundry-hand', name: 'Lessive Main' },
            { id: 'floor-cleaners', name: 'Nettoyage Sols' },
            { id: 'bleach', name: 'Eau de Javel' },
            { id: 'dishes', name: 'Vaisselle' },
            { id: 'air-fresheners', name: 'Désodorisants' },
            { id: 'insecticides', name: 'Insecticides' },
        ]
    },
    {
        id: 'household',
        name: 'Maison & Papeterie',
        icon: '📦',
        color: '#8A8078',
        subcategories: [
            { id: 'disposables', name: 'Jetables (Alu, Film, Gobelets)' },
            { id: 'paper-products', name: 'Papier (Essuie-tout, Mouchoirs)' },
            { id: 'school-supplies', name: 'Papeterie Scolaire' },
            { id: 'batteries', name: 'Piles & Ampoules' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: SNACKS & APÉRITIFS
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'snacks',
        name: 'Snacks & Apéritifs',
        icon: '🍿',
        color: '#D4875A',
        subcategories: [
            { id: 'chips', name: 'Chips' },
            { id: 'nuts-seeds', name: 'Fruits Secs & Graines' },
            { id: 'popcorn', name: 'Pop-corn' },
            { id: 'crackers', name: 'Biscuits Apéritifs' },
        ]
    },

    // ═══════════════════════════════════════════════════════════════
    // DÉPARTEMENT: ANIMAUX
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'pets',
        name: 'Animaux',
        icon: '🐕',
        color: '#7A6B55',
        subcategories: [
            { id: 'dog-food', name: 'Alimentation Chien' },
            { id: 'cat-food', name: 'Alimentation Chat' },
            { id: 'bird-food', name: 'Alimentation Oiseaux' },
            { id: 'pet-accessories', name: 'Accessoires' },
        ]
    },
];

/**
 * Common Algerian Brands - Organized by category
 */
export const COMMON_BRANDS = [
    // === Produits Laitiers ===
    'Candia', 'Soummam', 'Danone', 'Trefle', 'Ramdy', 'Hodna', 'Safilait',
    // === Fromages ===
    'La Vache Qui Rit', 'Tartino', 'Chef', 'Walid', 'Berber', 'Tessala',
    // === Boissons ===
    'Hamoud Boualem', 'Ifri', 'Rouiba', 'Coca-Cola', 'Pepsi', 'Fanta', 'Sprite',
    'Ngaous', 'Vitajus', 'Toudja',
    // === Huiles & Corps Gras ===
    'Cevital', 'Elio', 'Afia', 'Fleurial', 'Safia', 'Labelle',
    // === Biscuiterie & Chocolaterie ===
    'Bimo', 'Bifa', 'Saida', 'Palmary', 'Swareen', 'Ambassadeur', 'El Mordjane',
    // === Café ===
    'Bonal', 'Aroma', 'Famico', 'Nescafé', 'Amazigh',
    // === Pâtes & Semoules ===
    'Amor Benamor', 'SIM', 'Mama', 'El Baraka', 'Ama',
    // === Conserves ===
    'Izdihar', 'CAB', 'Sidi Ahmed', 'Isabel', 'Ricamar',
    // === Charcuterie ===
    'Bellat', 'Bentoumia', 'Dolina',
    // === Entretien ===
    'Aigle', 'Isis', 'Bref', 'Sanibo', 'Doz', 'Cotex',
    // === Hygiène ===
    'Venus', 'Dove', 'Lux', 'Palmolive', 'Sunsilk', 'Head & Shoulders',
    // === Couches ===
    'Molfix', 'Canbebe', 'Bimbies', 'Pampers',
    // === Détergents ===
    'Ariel', 'Omo', 'Tide', 'Persil',
    // === Oral Care ===
    'Signal', 'Colgate', 'Sensodyne',
];

/**
 * Common Product Natures/Descriptions - Algerian Context
 * Structure: [Marque] + [Gamme/Variété] + [Attribut] + [Quantité + Unité]
 */
export const PRODUCT_NATURES = [
    // === Produits Laitiers ===
    'Lait Entier UHT', 'Lait Demi-Écrémé UHT', 'Lait Écrémé', 'Lait Sachet',
    'L\'ben Nature', 'Raïb Nature', 'Raïb aux Fruits',
    'Yaourt Nature', 'Yaourt aux Fruits', 'Yaourt Brassé', 'Yaourt à Boire',
    'Fromage Fondu Portions', 'Fromage à Tartiner', 'Fromage Râpé',
    'Crème Fraîche Épaisse', 'Crème Fraîche Fluide',

    // === Boissons ===
    'Eau Minérale Naturelle', 'Eau Minérale Gazeuse',
    'Limonade Gazeuse', 'Soda Cola', 'Orangeade',
    'Jus d\'Orange', 'Jus de Pomme', 'Jus Multivitaminé', 'Nectar de Fruits',

    // === Café & Thé ===
    'Café Moulu Pur Arabica', 'Café Moulu Mélange', 'Café Soluble',
    'Café en Grains Torréfié', 'Thé Vert à la Menthe', 'Thé Noir Earl Grey',

    // === Épicerie Salée ===
    'Huile de Table', 'Huile de Tournesol', 'Huile d\'Olive Extra Vierge',
    'Sucre Blanc', 'Sucre Glace', 'Sucre Roux',
    'Farine de Blé Tendre', 'Semoule Fine', 'Semoule Moyenne', 'Semoule Grosse',
    'Couscous Fin', 'Couscous Moyen', 'Couscous Roulé Main',
    'Pâtes Spaghetti', 'Pâtes Macaroni', 'Pâtes Coquillettes', 'Pâtes Torsades',
    'Rechta Traditionnelle', 'Tlitli', 'Trida', 'Berkoukes',
    'Riz Long Grain', 'Riz Rond', 'Riz Basmati',
    'Concentré de Tomate', 'Double Concentré de Tomate',
    'Harissa', 'Moutarde', 'Mayonnaise', 'Ketchup',
    'Smen Végétal', 'Smen Traditionnel',

    // === Conserves ===
    'Thon à l\'Huile', 'Thon au Naturel', 'Sardines à l\'Huile',
    'Pois Chiches en Conserve', 'Haricots Blancs', 'Champignons',
    'Olives Vertes', 'Olives Noires', 'Cornichons',

    // === Biscuiterie ===
    'Biscuits Secs', 'Galettes', 'Gaufrettes Fourrées',
    'Biscuits Fourrés Chocolat', 'Madeleines', 'Cake Marbré',
    'Chocolat au Lait', 'Chocolat Noir', 'Chocolat aux Noisettes',
    'Pâte à Tartiner Chocolat', 'Pâte à Tartiner Noisettes',
    'Confiture Abricot', 'Confiture Fraise', 'Miel Naturel',

    // === Viandes ===
    'Viande Hachée Bœuf', 'Escalope de Poulet', 'Cuisses de Poulet',
    'Côtelettes d\'Agneau', 'Gigot d\'Agneau',
    'Cachir Tranché', 'Merguez', 'Saucisses de Volaille',

    // === Entretien ===
    'Lessive Poudre Machine', 'Lessive Liquide Machine', 'Lessive Main',
    'Eau de Javel', 'Nettoyant Multi-Surfaces', 'Nettoyant Sol Parfumé',
    'Liquide Vaisselle', 'Désodorisant Aérosol',

    // === Hygiène ===
    'Gel Douche', 'Savon de Toilette', 'Savon Liquide Main',
    'Shampoing Cheveux Normaux', 'Shampoing Anti-Pelliculaire',
    'Dentifrice Blancheur', 'Dentifrice Fraîcheur', 'Brosse à Dents',
    'Déodorant Spray', 'Déodorant Roll-on',

    // === Bébé ===
    'Couches Taille 1', 'Couches Taille 2', 'Couches Taille 3', 'Couches Taille 4',
    'Céréales Bébé', 'Petit Pot Légumes', 'Lait 1er Âge', 'Lait 2ème Âge',

    // === Snacks ===
    'Chips Nature', 'Chips Paprika', 'Chips Fromage',
    'Cacahuètes Grillées', 'Amandes', 'Noix de Cajou',
    'Pop-corn Caramel', 'Pop-corn Salé',
];

/**
 * Algerian Search Synonyms - For query expansion
 */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
    'gazouz': ['boissons gazeuses', 'soda', 'limonade', 'hamoud'],
    'dhan': ['smen', 'margarine', 'beurre'],
    'momtaza': ['margarine', 'matière grasse'],
    'khobz': ['pain', 'baguette'],
    'lben': ['lait fermenté', 'leben', 'l\'ben'],
    'raib': ['yaourt', 'lait caillé'],
    'cachir': ['charcuterie', 'jambon'],
};

// Product Types for Bundle System
export type ProductType = 'standard' | 'component' | 'bundle';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    subcategories?: { id: string; name: string }[];
}

export interface PriceHistoryEntry {
    date: Date | string;
    oldPrice: number;
    newPrice: number;
}

export interface Product {
    id: string;
    barcode: string;
    sku: string;
    name: string;
    designation: string;
    emoji: string;
    brand?: string;
    nature?: string;
    variety?: string;        // Parfum/Variété (ex: Fraise, Nature, Lavande)
    shortName?: string;      // Nom court pour ticket de caisse (max ~30 chars)
    category: string;
    categoryId?: string;
    subcategoryId?: string;
    purchasePrice: number;
    sellingPrice: number;
    buyPrice?: number;
    sellPrice?: number;
    stock: number;
    minStock: number;
    unit: string;
    quantity?: number;
    volume?: number;
    volumeUnit?: string;
    isActive: boolean;
    isFavorite: boolean;
    isLocalProduct?: boolean; // Flag for "Made in Bladi" products

    // === PACKAGING CONCEPTS (SEPARATED) ===
    // Supplier packaging - how products are received from suppliers
    unitsPerCarton?: number;      // Units per supplier carton (for stock reception)
    cartonBarcode?: string;       // Optional barcode for the carton itself

    // Customer packaging - how products are sold in packs at POS
    unitsPerSellingPack?: number; // Units per selling pack (for POS bundle sales)
    sellingPackPrice?: number;    // Price for the selling pack (if different from unit x qty)

    // Legacy field - keep for backward compatibility, maps to unitsPerSellingPack
    unitsPerPack?: number;
    productType?: 'standard' | 'component' | 'bundle';
    priceHistory?: PriceHistoryEntry[];
    createdAt: Date | string;
    updatedAt: Date | string;

    // Optional fields
    ean?: string;
    nameAr?: string;
    supplierId?: string;
    vatRate?: number;
    isPerishable?: boolean;
    shelfLifeDays?: number;
    imageUrl?: string;
}


// Bundle Component for complex bundles with multiple products
export interface BundleComponent {
    bundleId: string;
    componentProductId: string;
    quantity: number;
}

// Bundle definition for UI
export interface Bundle {
    id: string;
    name: string;
    sku: string;
    barcode?: string;
    components: {
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
    }[];
    totalUnitPrice: number;
    bundlePrice: number;
    discount: number;
    stock: number;
    isActive: boolean;
}

// Stock receipt entry
export interface StockReceiptEntry {
    productId: string;
    product: Product;
    receivedAs: 'units' | 'packs';
    quantityReceived: number;
    unitsPerPack: number;
    totalUnits: number;
    buyPricePerUnit: number;
    expirationDate?: Date;
    batchNumber?: string;
    notes?: string;
}

// Helper functions for bundle calculations
export const calculateAvailablePacks = (componentStock: number, unitsPerPack: number): number => {
    if (unitsPerPack <= 0) return 0;
    return Math.floor(componentStock / unitsPerPack);
};

export const calculateTotalUnits = (packs: number, unitsPerPack: number): number => {
    return packs * unitsPerPack;
};

export const calculateBundleDiscount = (unitPriceTotal: number, bundlePrice: number): number => {
    if (unitPriceTotal <= 0) return 0;
    return Math.round(((unitPriceTotal - bundlePrice) / unitPriceTotal) * 100);
};

/**
 * Calculate price per liter/kg for comparison
 */
export const calculatePricePerUnit = (price: number, volume: number, volumeUnit: string): number => {
    if (!volume || volume <= 0) return 0;

    // Convert to base unit (L or Kg)
    let multiplier = 1;
    switch (volumeUnit.toLowerCase()) {
        case 'ml': multiplier = 1000; break;
        case 'cl': multiplier = 100; break;
        case 'g': multiplier = 1000; break;
        default: multiplier = 1;
    }

    return (price * multiplier) / volume;
};
