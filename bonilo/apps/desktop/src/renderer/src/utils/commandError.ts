/**
 * Maps Rust money-core AppError codes to French user messages.
 * Tauri rejects commands with { code: string, message: string }.
 */

interface CommandError {
    code?: string;
    message?: string;
}

const CODE_MESSAGES: Record<string, string> = {
    EMPTY_CART: 'Le panier est vide.',
    INSUFFICIENT_STOCK: 'Stock insuffisant pour un ou plusieurs articles.',
    UNKNOWN_PRODUCT: 'Produit introuvable en base.',
    UNKNOWN_SUPPLIER: 'Fournisseur introuvable.',
    UNKNOWN_CUSTOMER: 'Client introuvable.',
    CREDIT_REQUIRES_CUSTOMER: 'Une vente à crédit nécessite un client sélectionné.',
    INVALID_INPUT: 'Données invalides.',
    DB_ERROR: 'Erreur base de données.',
    POOL_NOT_FOUND: 'Erreur de connexion à la base de données.',
};

/**
 * Returns a French user-facing message for a Tauri command rejection.
 * Falls back to the raw English message if the code is unrecognized,
 * or to `fallback` if no message exists at all.
 */
export function commandErrorMessage(err: unknown, fallback: string): string {
    if (!err) return fallback;

    const e = err as CommandError;

    if (e.code && CODE_MESSAGES[e.code]) {
        return CODE_MESSAGES[e.code];
    }

    return e.message || (typeof err === 'string' ? err : fallback);
}
