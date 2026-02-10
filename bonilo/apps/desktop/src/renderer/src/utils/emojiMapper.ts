/**
 * Emoji Mapper - Auto-assigns emojis based on product name/nature/category
 * Used in product creation to suggest appropriate emojis
 */

// Common product keywords to emoji mappings
const KEYWORD_EMOJI_MAP: Record<string, string> = {
    // Beverages
    'eau': '💧',
    'water': '💧',
    'juice': '🧃',
    'jus': '🧃',
    'soda': '🥤',
    'cola': '🥤',
    'coca': '🥤',
    'pepsi': '🥤',
    'limonade': '🍋',
    'orange': '🍊',
    'pomme': '🍎',
    'citron': '🍋',
    'café': '☕',
    'coffee': '☕',
    'thé': '🍵',
    'tea': '🍵',
    'lait': '🥛',
    'milk': '🥛',
    'yaourt': '🥛',
    'yogurt': '🥛',
    'lben': '🥛',

    // Dairy
    'fromage': '🧀',
    'cheese': '🧀',
    'beurre': '🧈',
    'butter': '🧈',
    'crème': '🍦',
    'cream': '🍦',
    'oeuf': '🥚',
    'egg': '🥚',

    // Bread & Bakery
    'pain': '🍞',
    'bread': '🍞',
    'baguette': '🥖',
    'croissant': '🥐',
    'gateau': '🎂',
    'cake': '🎂',
    'biscuit': '🍪',
    'cookie': '🍪',

    // Fruits & Vegetables
    'fruit': '🍎',
    'fruits': '🍎',
    'légume': '🥬',
    'legume': '🥬',
    'vegetable': '🥬',
    'tomate': '🍅',
    'tomato': '🍅',
    'carotte': '🥕',
    'carrot': '🥕',
    'pomme de terre': '🥔',
    'potato': '🥔',
    'oignon': '🧅',
    'onion': '🧅',
    'ail': '🧄',
    'garlic': '🧄',
    'salade': '🥗',
    'salad': '🥗',
    'banane': '🍌',
    'banana': '🍌',
    'raisin': '🍇',
    'grape': '🍇',
    'pastèque': '🍉',
    'watermelon': '🍉',
    'fraise': '🍓',
    'strawberry': '🍓',
    'cerise': '🍒',
    'cherry': '🍒',
    'pêche': '🍑',
    'peach': '🍑',
    'ananas': '🍍',
    'pineapple': '🍍',
    'mangue': '🥭',
    'mango': '🥭',
    'avocat': '🥑',
    'avocado': '🥑',

    // Meat & Fish
    'viande': '🥩',
    'meat': '🥩',
    'poulet': '🍗',
    'chicken': '🍗',
    'poisson': '🐟',
    'fish': '🐟',
    'sardine': '🐟',
    'thon': '🐟',
    'tuna': '🐟',
    'crevette': '🦐',
    'shrimp': '🦐',

    // Canned & Preserved
    'conserve': '🥫',
    'canned': '🥫',
    'harissa': '🌶️',
    'piment': '🌶️',
    'concentré': '🥫',
    'tomate concentrée': '🥫',

    // Grain & Pasta
    'riz': '🍚',
    'rice': '🍚',
    'pâte': '🍝',
    'pasta': '🍝',
    'spaghetti': '🍝',
    'macaroni': '🍝',
    'couscous': '🍚',
    'semoule': '🌾',
    'farine': '🌾',
    'flour': '🌾',

    // Snacks
    'chips': '🍟',
    'chocolat': '🍫',
    'chocolate': '🍫',
    'bonbon': '🍬',
    'candy': '🍬',
    'sucre': '🍬',
    'sugar': '🍬',
    'glace': '🍦',
    'ice cream': '🍦',
    'pop corn': '🍿',
    'popcorn': '🍿',

    // Hygiene & Cleaning
    'savon': '🧼',
    'soap': '🧼',
    'shampoo': '🧴',
    'shampooing': '🧴',
    'dentifrice': '🪥',
    'toothpaste': '🪥',
    'papier': '🧻',
    'toilet': '🧻',
    'mouchoir': '🧻',
    'tissue': '🧻',
    'detergent': '🧹',
    'lessive': '🧹',
    'nettoyant': '🧹',
    'cleaner': '🧹',
    'javel': '🧪',
    'bleach': '🧪',

    // Baby
    'bébé': '👶',
    'baby': '👶',
    'couche': '👶',
    'diaper': '👶',
    'biberon': '🍼',
    'bottle': '🍼',

    // Oil & Condiments
    'huile': '🫒',
    'oil': '🫒',
    'olive': '🫒',
    'vinaigre': '🍶',
    'vinegar': '🍶',
    'sel': '🧂',
    'salt': '🧂',
    'poivre': '🌶️',
    'pepper': '🌶️',
    'moutarde': '🌭',
    'mustard': '🌭',
    'ketchup': '🍅',
    'mayonnaise': '🥚',
    'mayo': '🥚',

    // Misc
    'miel': '🍯',
    'honey': '🍯',
    'confiture': '🍓',
    'jam': '🍓',
    'pizza': '🍕',
    'burger': '🍔',
    'sandwich': '🥪',
    'hot dog': '🌭',
    'wrap': '🌯',
    'taco': '🌮',
    'sushi': '🍣',
    'nouille': '🍜',
    'noodle': '🍜',
};

// Category to default emoji mapping
const CATEGORY_EMOJI_MAP: Record<string, string> = {
    'beverages': '🥤',
    'boissons': '🥤',
    'dairy': '🥛',
    'produits laitiers': '🥛',
    'laitiers': '🥛',
    'bakery': '🥖',
    'boulangerie': '🥖',
    'fruits': '🍎',
    'légumes': '🥬',
    'fruits & légumes': '🍎',
    'meat': '🥩',
    'viandes': '🥩',
    'fish': '🐟',
    'poisson': '🐟',
    'seafood': '🦐',
    'grocery': '🛒',
    'épicerie': '🛒',
    'epicerie': '🛒',
    'snacks': '🍿',
    'biscuits': '🍪',
    'biscuiterie': '🍪',
    'frozen': '❄️',
    'surgelés': '❄️',
    'hygiene': '🧴',
    'hygiène': '🧴',
    'cleaning': '🧹',
    'entretien': '🧹',
    'baby': '👶',
    'bébé': '👶',
    'pet': '🐾',
    'animaux': '🐾',
    'condiments': '🧂',
    'sauces': '🥫',
    'canned': '🥫',
    'conserves': '🥫',
};

// Popular emoji options for quick selection
export const POPULAR_EMOJIS = [
    '📦', '🛒', '🥛', '🍞', '🥖', '🧀', '🥚', '🍎', '🍊', '🍌',
    '🥬', '🍅', '🥕', '🧅', '🥩', '🍗', '🐟', '🦐', '🍝', '🍚',
    '🥫', '🌶️', '🧂', '🫒', '🍯', '☕', '🍵', '🥤', '🧃', '💧',
    '🍫', '🍪', '🍬', '🍿', '🧼', '🧴', '🧹', '🧻', '👶', '🍼',
];

/**
 * Analyzes product text and returns the most appropriate emoji
 * @param name Product name
 * @param nature Product nature/description
 * @param categoryId Product category ID
 * @returns Best matching emoji
 */
export function getAutoEmoji(
    name?: string,
    nature?: string,
    categoryId?: string
): string {
    const searchText = `${name || ''} ${nature || ''}`.toLowerCase();

    // First, try to match keywords in the product name/nature
    for (const [keyword, emoji] of Object.entries(KEYWORD_EMOJI_MAP)) {
        if (searchText.includes(keyword.toLowerCase())) {
            return emoji;
        }
    }

    // If no keyword match, try category
    if (categoryId) {
        const categoryLower = categoryId.toLowerCase();
        for (const [category, emoji] of Object.entries(CATEGORY_EMOJI_MAP)) {
            if (categoryLower.includes(category) || category.includes(categoryLower)) {
                return emoji;
            }
        }
    }

    // Default fallback
    return '📦';
}

/**
 * Returns a list of suggested emojis based on product details
 * @param name Product name
 * @param nature Product nature
 * @param categoryId Category ID
 * @returns Array of suggested emojis (max 8)
 */
export function getSuggestedEmojis(
    name?: string,
    nature?: string,
    categoryId?: string
): string[] {
    const suggestions: Set<string> = new Set();
    const searchText = `${name || ''} ${nature || ''}`.toLowerCase();

    // Add matches from keywords
    for (const [keyword, emoji] of Object.entries(KEYWORD_EMOJI_MAP)) {
        if (searchText.includes(keyword.toLowerCase())) {
            suggestions.add(emoji);
            if (suggestions.size >= 4) break;
        }
    }

    // Add category emoji
    if (categoryId) {
        const categoryLower = categoryId.toLowerCase();
        for (const [category, emoji] of Object.entries(CATEGORY_EMOJI_MAP)) {
            if (categoryLower.includes(category) || category.includes(categoryLower)) {
                suggestions.add(emoji);
                break;
            }
        }
    }

    // Fill with popular emojis if needed
    for (const emoji of POPULAR_EMOJIS) {
        if (suggestions.size >= 8) break;
        suggestions.add(emoji);
    }

    return Array.from(suggestions).slice(0, 8);
}

export default getAutoEmoji;
