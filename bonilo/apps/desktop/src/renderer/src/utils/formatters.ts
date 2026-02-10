/**
 * Centralized Formatting Utilities
 * SuperMarket Control OS - Project CRYSTALLIZE
 * 
 * Single source of truth for all currency/date formatting.
 * All components should import from here instead of defining local functions.
 */

/**
 * Format a number as Algerian Dinar currency
 * @param value - The numeric value to format
 * @param currency - Currency symbol (default: 'DA')
 * @returns Formatted string like "1 234 DA"
 */
export const formatCurrency = (value: number, currency = 'DA'): string => {
    return new Intl.NumberFormat('fr-DZ').format(Math.round(value)) + ' ' + currency;
};

/**
 * Format currency in compact notation for large numbers
 * @param value - The numeric value to format
 * @returns Formatted string like "1,2M DA"
 */
export const formatCurrencyCompact = (value: number): string => {
    return new Intl.NumberFormat('fr-DZ', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(value) + ' DA';
};

/**
 * Format a date in French locale
 * @param date - Date object or ISO string
 * @param format - 'short' (2 janv. 2026), 'long' (lundi 2 janvier 2026), 'full' (02/01/2026)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const options: Intl.DateTimeFormatOptions = format === 'short'
        ? { day: '2-digit', month: 'short', year: 'numeric' }
        : format === 'long'
            ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
            : { day: '2-digit', month: '2-digit', year: 'numeric' };
    return d.toLocaleDateString('fr-FR', options);
};

/**
 * Format date with short month (for compact displays)
 * @param date - Date object
 * @returns Formatted string like "2 janv."
 */
export const formatDateShort = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    });
};

/**
 * Format date with time
 * @param date - Date object or ISO string
 * @returns Formatted string like "02 janv. 2026 14:30"
 */
export const formatDateTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format time only
 * @param date - Date object
 * @returns Formatted string like "14:30"
 */
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
