/**
 * Stress Test Script: Generate 50,000 Sample Products
 * Usage: Import this file and call generateTestProducts(50000)
 */

const categories = [
    'Boissons', 'Produits laitiers', 'Épicerie', 'Biscuiterie',
    'Fruits & Légumes', 'Viandes', 'Surgélés', 'Hygiène',
    'Conserves', 'Céréales', 'Confiserie', 'Snacks'
];

const brands = [
    'Coca-Cola', 'Pepsi', 'Danone', 'Nestlé', 'Kraft', 'Unilever',
    'P&G', 'Heinz', 'Kellogg\'s', 'Mars', 'Ferrero', 'Mondelez',
    'Ramy', 'Soummam', 'Candia', 'Ifri', 'Hamoud Boualem', 'N\'Gaous'
];

const productPrefixes = [
    'Lait', 'Eau', 'Jus', 'Yaourt', 'Fromage', 'Beurre',
    'Pain', 'Biscuit', 'Chocolat', 'Café', 'Thé', 'Sucre',
    'Huile', 'Riz', 'Pâtes', 'Semoule', 'Farine', 'Sel',
    'Chips', 'Soda', 'Limonade', 'Sirop', 'Miel', 'Confiture'
];

const units = ['unité', 'kg', 'g', 'L', 'ml', 'pack'];

const emojis = ['🥛', '🧃', '🍞', '🧀', '🍫', '☕', '🍪', '🥤', '🍎', '🥕', '🍗', '🧊', '🧴', '🍬'];

function randomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateBarcode(): string {
    // Generate EAN-13 style barcode
    let barcode = '614';  // Algeria prefix
    for (let i = 0; i < 10; i++) {
        barcode += Math.floor(Math.random() * 10);
    }
    return barcode;
}

function generateSKU(index: number): string {
    const prefix = randomFromArray(['PRD', 'SKU', 'ITM', 'ART']);
    return `${prefix}-${String(index).padStart(6, '0')}`;
}

export interface TestProduct {
    id: string;
    name: string;
    barcode: string;
    sku: string;
    category: string;
    brand: string;
    purchasePrice: number;
    sellingPrice: number;
    stock: number;
    minStock: number;
    unit: string;
    emoji: string;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export function generateTestProducts(count: number = 50000): TestProduct[] {
    console.log(`[StressTest] Generating ${count.toLocaleString()} products...`);
    const startTime = performance.now();

    const products: TestProduct[] = [];
    const usedBarcodes = new Set<string>();

    for (let i = 0; i < count; i++) {
        // Generate unique barcode
        let barcode: string;
        do {
            barcode = generateBarcode();
        } while (usedBarcodes.has(barcode));
        usedBarcodes.add(barcode);

        const prefix = randomFromArray(productPrefixes);
        const brand = randomFromArray(brands);
        const category = randomFromArray(categories);

        // Realistic price range in DZD
        const purchasePrice = Math.floor(Math.random() * 2000) + 50; // 50-2050 DA
        const marginPercent = 15 + Math.floor(Math.random() * 35); // 15-50% margin
        const sellingPrice = Math.round(purchasePrice * (1 + marginPercent / 100));

        // Stock levels
        const stock = Math.floor(Math.random() * 500);
        const minStock = Math.floor(Math.random() * 20) + 5;

        const product: TestProduct = {
            id: `prod_test_${Date.now()}_${i}`,
            name: `${prefix} ${brand} ${Math.floor(Math.random() * 1000)}g`,
            barcode,
            sku: generateSKU(i),
            category,
            brand,
            purchasePrice,
            sellingPrice,
            stock,
            minStock,
            unit: randomFromArray(units),
            emoji: randomFromArray(emojis),
            isFavorite: Math.random() < 0.05, // 5% favorites
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        products.push(product);

        // Progress logging every 10k
        if ((i + 1) % 10000 === 0) {
            console.log(`[StressTest] Generated ${(i + 1).toLocaleString()} products...`);
        }
    }

    const endTime = performance.now();
    console.log(`[StressTest] ✅ Generated ${count.toLocaleString()} products in ${(endTime - startTime).toFixed(0)}ms`);

    return products;
}

/**
 * Load test products into the products store
 */
export async function loadTestProductsToStore(count: number = 50000): Promise<void> {
    const { useProductsStore } = await import('@bonilo/shared/stores');

    console.log('[StressTest] Loading products into store...');
    const products = generateTestProducts(count);

    // Batch insert to avoid overwhelming the store
    const batchSize = 5000;
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        useProductsStore.setState((state) => ({
            products: [...state.products, ...batch as any[]]
        }));

        // Allow UI to breathe
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log('[StressTest] ✅ All products loaded to store');
}

/**
 * Benchmark: Measure search/filter performance
 */
export function benchmarkSearch(products: TestProduct[], query: string): void {
    console.log(`[Benchmark] Searching ${products.length.toLocaleString()} products for "${query}"...`);

    const startTime = performance.now();
    const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode.includes(query)
    );
    const endTime = performance.now();

    console.log(`[Benchmark] Found ${results.length.toLocaleString()} results in ${(endTime - startTime).toFixed(2)}ms`);
}

// Export for console testing
if (typeof window !== 'undefined') {
    (window as any).stressTest = {
        generateTestProducts,
        loadTestProductsToStore,
        benchmarkSearch
    };
    console.log('[StressTest] Available commands:');
    console.log('  stressTest.generateTestProducts(50000)');
    console.log('  stressTest.loadTestProductsToStore(50000)');
    console.log('  stressTest.benchmarkSearch(products, "Lait")');
}
