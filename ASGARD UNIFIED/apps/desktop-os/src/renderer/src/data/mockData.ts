/**
 * Mock Data for Testing
 * ASGARD Unified - IGO Retail Management Ecosystem
 * Realistic Algerian Supermarket Data
 */

import { Product, Customer, Sale, SaleItem } from '@asgard/shared';

// ============================================================================
// MOCK PRODUCTS - Algerian Supermarket Inventory
// ============================================================================

export const MOCK_PRODUCTS: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
    // === PRODUITS LAITIERS ===
    {
        barcode: '6130100000012',
        sku: 'LAI-CAN-001',
        name: 'Lait Entier Candia 1L',
        designation: 'Lait UHT Entier',
        emoji: '🥛',
        brand: 'Candia',
        nature: 'Lait Entier UHT',
        category: 'Produits Laitiers',
        categoryId: 'dairy-fresh',
        subcategoryId: 'milk-uht',
        purchasePrice: 95,
        sellingPrice: 120,
        stock: 150,
        minStock: 30,
        unit: 'unit',
        volume: 1000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },
    {
        barcode: '6130100000029',
        sku: 'LAI-SOU-002',
        name: 'L\'ben Soummam 1L',
        designation: 'L\'ben Nature',
        emoji: '🥛',
        brand: 'Soummam',
        nature: 'L\'ben Nature',
        category: 'Produits Laitiers',
        categoryId: 'dairy-fresh',
        subcategoryId: 'lben-raib',
        purchasePrice: 85,
        sellingPrice: 110,
        stock: 80,
        minStock: 20,
        unit: 'unit',
        volume: 1000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130100000036',
        sku: 'FRO-VQR-001',
        name: 'La Vache Qui Rit 16 portions',
        designation: 'Fromage Fondu Portions',
        emoji: '🧀',
        brand: 'La Vache Qui Rit',
        nature: 'Fromage Fondu Portions',
        category: 'Fromagerie',
        categoryId: 'cheese',
        subcategoryId: 'cheese-portions',
        purchasePrice: 220,
        sellingPrice: 280,
        stock: 45,
        minStock: 10,
        unit: 'box',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },
    {
        barcode: '6130100000043',
        sku: 'YAO-DAN-001',
        name: 'Danone Fruité Fraise 4x110g',
        designation: 'Yaourt aux Fruits',
        emoji: '🍓',
        brand: 'Danone',
        nature: 'Yaourt aux Fruits',
        category: 'Produits Laitiers',
        categoryId: 'dairy-fresh',
        subcategoryId: 'yogurt',
        purchasePrice: 140,
        sellingPrice: 180,
        stock: 60,
        minStock: 15,
        unit: 'pack',
        isActive: true,
        isFavorite: false,
        isLocalProduct: false,
    },

    // === BOISSONS ===
    {
        barcode: '6130200000015',
        sku: 'BOI-HAM-001',
        name: 'Hamoud Boualem Original 1L',
        designation: 'Limonade Gazeuse',
        emoji: '🥤',
        brand: 'Hamoud Boualem',
        nature: 'Limonade Gazeuse',
        category: 'Boissons',
        categoryId: 'beverages',
        subcategoryId: 'gazouz',
        purchasePrice: 80,
        sellingPrice: 100,
        stock: 200,
        minStock: 50,
        unit: 'bottle',
        volume: 1000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130200000022',
        sku: 'BOI-IFR-001',
        name: 'Ifri 1.5L',
        designation: 'Eau Minérale Naturelle',
        emoji: '💧',
        brand: 'Ifri',
        nature: 'Eau Minérale Naturelle',
        category: 'Boissons',
        categoryId: 'beverages',
        subcategoryId: 'water-mineral',
        purchasePrice: 30,
        sellingPrice: 45,
        stock: 500,
        minStock: 100,
        unit: 'bottle',
        volume: 1500,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130200000039',
        sku: 'BOI-ROU-001',
        name: 'Rouiba Jus d\'Orange 1L',
        designation: 'Jus d\'Orange',
        emoji: '🍊',
        brand: 'Rouiba',
        nature: 'Jus d\'Orange',
        category: 'Boissons',
        categoryId: 'beverages',
        subcategoryId: 'juices',
        purchasePrice: 110,
        sellingPrice: 140,
        stock: 75,
        minStock: 20,
        unit: 'bottle',
        volume: 1000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: false,
        isLocalProduct: true,
    },
    {
        barcode: '5449000000996',
        sku: 'BOI-COC-001',
        name: 'Coca-Cola 1.5L',
        designation: 'Soda Cola',
        emoji: '🥤',
        brand: 'Coca-Cola',
        nature: 'Soda Cola',
        category: 'Boissons',
        categoryId: 'beverages',
        subcategoryId: 'gazouz',
        purchasePrice: 120,
        sellingPrice: 150,
        stock: 180,
        minStock: 40,
        unit: 'bottle',
        volume: 1500,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },

    // === ÉPICERIE SALÉE ===
    {
        barcode: '6130300000018',
        sku: 'HUI-CEV-001',
        name: 'Huile Elio 5L',
        designation: 'Huile de Table',
        emoji: '🫒',
        brand: 'Cevital',
        nature: 'Huile de Table',
        category: 'Épicerie Salée',
        categoryId: 'savory-grocery',
        subcategoryId: 'oil-table',
        purchasePrice: 850,
        sellingPrice: 990,
        stock: 40,
        minStock: 10,
        unit: 'bottle',
        volume: 5000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130300000025',
        sku: 'PAT-ABA-001',
        name: 'Spaghetti Amor Benamor 500g',
        designation: 'Pâtes Spaghetti',
        emoji: '🍝',
        brand: 'Amor Benamor',
        nature: 'Pâtes Spaghetti',
        category: 'Épicerie Salée',
        categoryId: 'savory-grocery',
        subcategoryId: 'pasta-long',
        purchasePrice: 75,
        sellingPrice: 95,
        stock: 120,
        minStock: 30,
        unit: 'pack',
        volume: 500,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130300000032',
        sku: 'COU-SIM-001',
        name: 'Couscous SIM Moyen 1Kg',
        designation: 'Couscous Moyen',
        emoji: '🍚',
        brand: 'SIM',
        nature: 'Couscous Moyen',
        category: 'Épicerie Salée',
        categoryId: 'savory-grocery',
        subcategoryId: 'couscous-semolina',
        purchasePrice: 140,
        sellingPrice: 175,
        stock: 85,
        minStock: 20,
        unit: 'pack',
        volume: 1000,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130300000049',
        sku: 'RIZ-LON-001',
        name: 'Riz Long Grain 1Kg',
        designation: 'Riz Long Grain',
        emoji: '🍚',
        brand: 'El Baraka',
        nature: 'Riz Long Grain',
        category: 'Épicerie Salée',
        categoryId: 'savory-grocery',
        subcategoryId: 'rice',
        purchasePrice: 120,
        sellingPrice: 160,
        stock: 95,
        minStock: 25,
        unit: 'pack',
        volume: 1000,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: false,
        isLocalProduct: false,
    },
    {
        barcode: '6130300000056',
        sku: 'TOM-IZD-001',
        name: 'Concentré de Tomate Izdihar 800g',
        designation: 'Concentré de Tomate',
        emoji: '🍅',
        brand: 'Izdihar',
        nature: 'Concentré de Tomate',
        category: 'Conserves',
        categoryId: 'canned-goods',
        subcategoryId: 'tomato-paste',
        purchasePrice: 180,
        sellingPrice: 220,
        stock: 65,
        minStock: 15,
        unit: 'can',
        volume: 800,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },

    // === CAFÉ & THÉ ===
    {
        barcode: '6130400000011',
        sku: 'CAF-BON-001',
        name: 'Café Bonal Moulu 250g',
        designation: 'Café Moulu Mélange',
        emoji: '☕',
        brand: 'Bonal',
        nature: 'Café Moulu Mélange',
        category: 'Café & Thé',
        categoryId: 'coffee-tea',
        subcategoryId: 'coffee-ground',
        purchasePrice: 280,
        sellingPrice: 350,
        stock: 55,
        minStock: 15,
        unit: 'pack',
        volume: 250,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '7612100000001',
        sku: 'CAF-NES-001',
        name: 'Nescafé Classic 100g',
        designation: 'Café Soluble',
        emoji: '☕',
        brand: 'Nescafé',
        nature: 'Café Soluble',
        category: 'Café & Thé',
        categoryId: 'coffee-tea',
        subcategoryId: 'coffee-instant',
        purchasePrice: 520,
        sellingPrice: 650,
        stock: 30,
        minStock: 8,
        unit: 'jar',
        volume: 100,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },

    // === BISCUITERIE ===
    {
        barcode: '6130500000014',
        sku: 'BIS-BIM-001',
        name: 'Biscuits Bimo Galettes 400g',
        designation: 'Galettes',
        emoji: '🍪',
        brand: 'Bimo',
        nature: 'Biscuits Secs',
        category: 'Épicerie Sucrée',
        categoryId: 'sweet-grocery',
        subcategoryId: 'biscuits-dry',
        purchasePrice: 90,
        sellingPrice: 120,
        stock: 90,
        minStock: 20,
        unit: 'pack',
        volume: 400,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },
    {
        barcode: '6130500000021',
        sku: 'CHO-AMB-001',
        name: 'Chocolat Ambassadeur Lait 100g',
        designation: 'Chocolat au Lait',
        emoji: '🍫',
        brand: 'Ambassadeur',
        nature: 'Chocolat au Lait',
        category: 'Épicerie Sucrée',
        categoryId: 'sweet-grocery',
        subcategoryId: 'chocolate-bars',
        purchasePrice: 85,
        sellingPrice: 110,
        stock: 70,
        minStock: 15,
        unit: 'unit',
        volume: 100,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: false,
        isLocalProduct: true,
    },

    // === CONSERVES ===
    {
        barcode: '6130600000017',
        sku: 'THO-ISA-001',
        name: 'Thon Isabel à l\'Huile 160g',
        designation: 'Thon à l\'Huile',
        emoji: '🐟',
        brand: 'Isabel',
        nature: 'Thon à l\'Huile',
        category: 'Conserves',
        categoryId: 'canned-goods',
        subcategoryId: 'tuna-sardines',
        purchasePrice: 200,
        sellingPrice: 260,
        stock: 50,
        minStock: 12,
        unit: 'can',
        volume: 160,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },
    {
        barcode: '6130600000024',
        sku: 'OLI-VER-001',
        name: 'Olives Vertes Dénoyautées 400g',
        designation: 'Olives Vertes',
        emoji: '🫒',
        brand: 'CAB',
        nature: 'Olives Vertes',
        category: 'Conserves',
        categoryId: 'canned-goods',
        subcategoryId: 'olives-pickles',
        purchasePrice: 180,
        sellingPrice: 240,
        stock: 40,
        minStock: 10,
        unit: 'jar',
        volume: 400,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: false,
        isLocalProduct: true,
    },

    // === HYGIÈNE & BEAUTÉ ===
    {
        barcode: '8710447000001',
        sku: 'SAV-DOV-001',
        name: 'Savon Dove Beauty Bar 100g',
        designation: 'Savon de Toilette',
        emoji: '🧼',
        brand: 'Dove',
        nature: 'Savon de Toilette',
        category: 'Hygiène & Beauté',
        categoryId: 'hygiene-beauty',
        subcategoryId: 'shower-soap',
        purchasePrice: 120,
        sellingPrice: 160,
        stock: 80,
        minStock: 20,
        unit: 'unit',
        volume: 100,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },
    {
        barcode: '8710447000002',
        sku: 'SHP-H&S-001',
        name: 'Shampooing Head & Shoulders 400ml',
        designation: 'Shampoing Anti-Pelliculaire',
        emoji: '🧴',
        brand: 'Head & Shoulders',
        nature: 'Shampoing Anti-Pelliculaire',
        category: 'Hygiène & Beauté',
        categoryId: 'hygiene-beauty',
        subcategoryId: 'hair-care',
        purchasePrice: 450,
        sellingPrice: 580,
        stock: 35,
        minStock: 8,
        unit: 'bottle',
        volume: 400,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: false,
        isLocalProduct: false,
    },
    {
        barcode: '8850006000001',
        sku: 'DEN-SIG-001',
        name: 'Dentifrice Signal Fraîcheur 100ml',
        designation: 'Dentifrice Fraîcheur',
        emoji: '🦷',
        brand: 'Signal',
        nature: 'Dentifrice Fraîcheur',
        category: 'Hygiène & Beauté',
        categoryId: 'hygiene-beauty',
        subcategoryId: 'oral-care',
        purchasePrice: 180,
        sellingPrice: 240,
        stock: 60,
        minStock: 15,
        unit: 'tube',
        volume: 100,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },

    // === ENTRETIEN MAISON ===
    {
        barcode: '6130700000010',
        sku: 'LES-ARI-001',
        name: 'Ariel Lessive Poudre 3Kg',
        designation: 'Lessive Poudre Machine',
        emoji: '🧺',
        brand: 'Ariel',
        nature: 'Lessive Poudre Machine',
        category: 'Entretien Maison',
        categoryId: 'cleaning',
        subcategoryId: 'laundry-machine',
        purchasePrice: 850,
        sellingPrice: 1100,
        stock: 25,
        minStock: 5,
        unit: 'pack',
        volume: 3000,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },
    {
        barcode: '6130700000027',
        sku: 'JAV-AIG-001',
        name: 'Eau de Javel Aigle 1L',
        designation: 'Eau de Javel',
        emoji: '🧴',
        brand: 'Aigle',
        nature: 'Eau de Javel',
        category: 'Entretien Maison',
        categoryId: 'cleaning',
        subcategoryId: 'bleach',
        purchasePrice: 55,
        sellingPrice: 75,
        stock: 100,
        minStock: 25,
        unit: 'bottle',
        volume: 1000,
        volumeUnit: 'ml',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },

    // === BÉBÉ ===
    {
        barcode: '8690536000001',
        sku: 'COU-MOL-001',
        name: 'Couches Molfix Taille 4 (32 pcs)',
        designation: 'Couches Taille 4',
        emoji: '👶',
        brand: 'Molfix',
        nature: 'Couches Taille 4',
        category: 'Univers Bébé',
        categoryId: 'baby',
        subcategoryId: 'diapers',
        purchasePrice: 750,
        sellingPrice: 950,
        stock: 20,
        minStock: 5,
        unit: 'pack',
        isActive: true,
        isFavorite: true,
        isLocalProduct: false,
    },

    // === SNACKS ===
    {
        barcode: '6130800000013',
        sku: 'CHI-NAT-001',
        name: 'Chips Nature 150g',
        designation: 'Chips Nature',
        emoji: '🍟',
        brand: 'Bifa',
        nature: 'Chips Nature',
        category: 'Snacks & Apéritifs',
        categoryId: 'snacks',
        subcategoryId: 'chips',
        purchasePrice: 90,
        sellingPrice: 120,
        stock: 85,
        minStock: 20,
        unit: 'pack',
        volume: 150,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: false,
        isLocalProduct: true,
    },

    // === FRUITS & LÉGUMES (si applicable) ===
    {
        barcode: '0000000000001',
        sku: 'DAT-DEG-001',
        name: 'Dattes Deglet Nour 500g',
        designation: 'Dattes',
        emoji: '🌴',
        brand: 'Tolga',
        nature: 'Dattes',
        category: 'Fruits & Légumes',
        categoryId: 'fruits-vegetables',
        subcategoryId: 'dates',
        purchasePrice: 400,
        sellingPrice: 550,
        stock: 45,
        minStock: 10,
        unit: 'pack',
        volume: 500,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
    },

    // === CHARCUTERIE ===
    {
        barcode: '6130900000016',
        sku: 'CAC-BEL-001',
        name: 'Cachir Bellat 200g',
        designation: 'Cachir Tranché',
        emoji: '🍖',
        brand: 'Bellat',
        nature: 'Cachir Tranché',
        category: 'Charcuterie',
        categoryId: 'charcuterie',
        subcategoryId: 'cachir',
        purchasePrice: 280,
        sellingPrice: 350,
        stock: 30,
        minStock: 8,
        unit: 'pack',
        volume: 200,
        volumeUnit: 'g',
        isActive: true,
        isFavorite: true,
        isLocalProduct: true,
        isPerishable: true,
        shelfLifeDays: 14,
    },
];

// ============================================================================
// MOCK CUSTOMERS - Algerian Customer Database
// ============================================================================

export const MOCK_CUSTOMERS: Omit<Customer, 'id' | 'loyaltyPoints' | 'currentCredit' | 'lastVisit' | 'lastPaymentDate' | 'createdAt'>[] = [
    {
        name: 'Ahmed Benali',
        phone: '0555123456',
        email: 'ahmed.benali@email.com',
        address: '15 Rue Didouche Mourad',
        city: 'Alger',
        creditLimit: 10000,
        barcode: 'CUST-0555123456',
    },
    {
        name: 'Fatima Zahra Boudiaf',
        phone: '0661789012',
        email: 'fatima.boudiaf@email.com',
        address: '32 Boulevard Krim Belkacem',
        city: 'Alger',
        creditLimit: 15000,
        barcode: 'CUST-0661789012',
    },
    {
        name: 'Mohamed Amine Khelifi',
        phone: '0770345678',
        email: 'amine.khelifi@email.com',
        address: '8 Cité El Badr',
        city: 'Blida',
        creditLimit: 8000,
        barcode: 'CUST-0770345678',
    },
    {
        name: 'Amira Hadj',
        phone: '0550901234',
        email: 'amira.hadj@email.com',
        address: '45 Rue Ben M\'hidi',
        city: 'Oran',
        creditLimit: 12000,
        barcode: 'CUST-0550901234',
    },
    {
        name: 'Youcef Mebarki',
        phone: '0666567890',
        email: 'youcef.mebarki@email.com',
        address: '22 Lotissement Les Oliviers',
        city: 'Tizi Ouzou',
        creditLimit: 5000,
        barcode: 'CUST-0666567890',
    },
    {
        name: 'Khadija Bensalem',
        phone: '0777123789',
        email: 'khadija.bensalem@email.com',
        address: '67 Rue Abane Ramdane',
        city: 'Constantine',
        creditLimit: 20000,
        barcode: 'CUST-0777123789',
    },
    {
        name: 'Samir Djelloul',
        phone: '0551456123',
        email: 'samir.djelloul@email.com',
        address: '3 Cité 500 Logements',
        city: 'Sétif',
        creditLimit: 7500,
        barcode: 'CUST-0551456123',
    },
    {
        name: 'Nadia Ferhat',
        phone: '0662890456',
        email: 'nadia.ferhat@email.com',
        address: '18 Avenue de l\'ALN',
        city: 'Béjaïa',
        creditLimit: 10000,
        barcode: 'CUST-0662890456',
    },
    {
        name: 'Rachid Lamrani',
        phone: '0773234567',
        email: 'rachid.lamrani@email.com',
        address: '54 Hai Essaada',
        city: 'Annaba',
        creditLimit: 6000,
        barcode: 'CUST-0773234567',
    },
    {
        name: 'Souad Belkacem',
        phone: '0554678901',
        email: 'souad.belkacem@email.com',
        address: '29 Rue des Frères Bellili',
        city: 'Batna',
        creditLimit: 9000,
        barcode: 'CUST-0554678901',
    },
];

// ============================================================================
// SEED DATA FUNCTION
// ============================================================================

/**
 * Initialize mock data in the stores
 */
export const seedMockData = async () => {
    // Import stores dynamically to avoid circular dependencies
    const { useProductsStore, useCustomersStore, useSalesStore } = await import('@asgard/shared/stores');

    const productsStore = useProductsStore.getState();
    const customersStore = useCustomersStore.getState();
    const salesStore = useSalesStore.getState();

    console.log('🔍 Current state:', {
        products: productsStore.products.length,
        customers: customersStore.customers.length,
        sales: salesStore.sales.length
    });

    // Force seed products if store is empty OR has fewer products than expected
    // This ensures we always have the full mock dataset
    const needsProductSeed = productsStore.products.length < MOCK_PRODUCTS.length;

    if (needsProductSeed) {
        console.log('🌱 Seeding products...');
        // Clear existing products first to avoid duplicates
        useProductsStore.setState({ products: [] });

        // Add all mock products
        for (const product of MOCK_PRODUCTS) {
            productsStore.addProduct(product);
        }
        console.log(`✅ Added ${MOCK_PRODUCTS.length} products`);
    } else {
        console.log('📦 Products already seeded:', productsStore.products.length);
    }

    // Seed customers if needed
    const needsCustomerSeed = customersStore.customers.length < MOCK_CUSTOMERS.length;

    if (needsCustomerSeed) {
        console.log('🌱 Seeding customers...');
        useCustomersStore.setState({ customers: [], transactions: [] });

        for (const customer of MOCK_CUSTOMERS) {
            customersStore.addCustomer(customer);
        }
        console.log(`✅ Added ${MOCK_CUSTOMERS.length} customers`);
    } else {
        console.log('👥 Customers already seeded:', customersStore.customers.length);
    }

    // Generate some recent sales (only if products exist and sales are empty)
    if (salesStore.sales.length === 0) {
        // Re-fetch products after seeding
        const products = useProductsStore.getState().products;

        if (products.length > 0) {
            console.log('🌱 Generating sample sales...');
            const sampleSales = generateSampleSales(products, 15);
            for (const sale of sampleSales) {
                salesStore.addSale(sale);
            }
            console.log(`✅ Generated ${sampleSales.length} sample sales`);
        } else {
            console.warn('⚠️ Cannot generate sales - no products available');
        }
    } else {
        console.log('💰 Sales already exist:', salesStore.sales.length);
    }

    console.log('🎉 Mock data seeding complete!');
};

/**
 * Generate sample sales for testing
 */
const generateSampleSales = (
    products: Product[],
    count: number
): Omit<Sale, 'id' | 'receiptNumber' | 'timestamp'>[] => {
    const sales: Omit<Sale, 'id' | 'receiptNumber' | 'timestamp'>[] = [];
    const paymentMethods: ('cash' | 'card' | 'cib' | 'dahabia')[] = ['cash', 'cash', 'cash', 'card', 'cib', 'dahabia'];

    for (let i = 0; i < count; i++) {
        // Random number of items (1-5)
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const items: SaleItem[] = [];
        let subtotal = 0;

        for (let j = 0; j < itemCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const total = product.sellingPrice * quantity;

            items.push({
                id: `item_${Date.now()}_${j}`,
                productId: product.id,
                productName: product.name,
                quantity,
                unitPrice: product.sellingPrice,
                total,
            });
            subtotal += total;
        }

        const taxAmount = Math.round(subtotal * 0.19); // 19% TVA
        const discountAmount = Math.random() > 0.7 ? Math.round(subtotal * 0.05) : 0; // 30% chance of 5% discount
        const totalAmount = subtotal + taxAmount - discountAmount;

        sales.push({
            items,
            subtotal,
            taxAmount,
            discountAmount,
            totalAmount,
            paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
            cashierId: 'cashier_001',
            cashierName: 'Caissier Principal',
            status: 'completed',
        });
    }

    return sales;
};

/**
 * Clear all mock data from stores
 */
export const clearMockData = async () => {
    const { useProductsStore, useCustomersStore } = await import('@asgard/shared/stores');

    // Reset to empty state - need to access the persist API
    useProductsStore.setState({ products: [] });
    useCustomersStore.setState({ customers: [], transactions: [] });

    console.log('🧹 Mock data cleared!');
};

export default {
    MOCK_PRODUCTS,
    MOCK_CUSTOMERS,
    seedMockData,
    clearMockData,
};
