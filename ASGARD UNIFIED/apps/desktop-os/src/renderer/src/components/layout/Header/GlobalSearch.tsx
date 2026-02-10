import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    X,
    Package,
    User,
    ShoppingCart,
    FileText,
    Settings,
    HelpCircle,
    TrendingUp,
    ChevronRight,
} from 'lucide-react';
import { useProductsStore } from '@asgard/shared/stores';
import styles from './GlobalSearch.module.css';

interface SearchResult {
    id: string;
    type: 'product' | 'customer' | 'page' | 'action';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    url?: string;
    action?: () => void;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

// Page/Navigation links
const PAGES: SearchResult[] = [
    { id: 'nav_dashboard', type: 'page', title: 'Tableau de bord', subtitle: 'Accueil et statistiques', icon: <TrendingUp size={18} />, url: '/' },
    { id: 'nav_pos', type: 'page', title: 'Caisse (POS)', subtitle: 'Point de vente', icon: <ShoppingCart size={18} />, url: '/pos' },
    { id: 'nav_inventory', type: 'page', title: 'Gestion de Stock', subtitle: 'Produits et inventaire', icon: <Package size={18} />, url: '/inventory' },
    { id: 'nav_treasury', type: 'page', title: 'Trésorerie', subtitle: 'Caisse et dépenses', icon: <FileText size={18} />, url: '/treasury' },
    { id: 'nav_customers', type: 'page', title: 'Clients', subtitle: 'Gestion des clients', icon: <User size={18} />, url: '/customers' },
    { id: 'nav_reports', type: 'page', title: 'Rapports & IA', subtitle: 'Analyses et prévisions', icon: <TrendingUp size={18} />, url: '/reports' },
    { id: 'nav_settings', type: 'page', title: 'Paramètres', subtitle: 'Configuration', icon: <Settings size={18} />, url: '/settings' },
    { id: 'nav_help', type: 'page', title: 'Aide & Support', subtitle: 'FAQ et documentation', icon: <HelpCircle size={18} />, url: '/help' },
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Get products from store
    const { products } = useProductsStore();

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults(PAGES.slice(0, 5)); // Show first 5 pages by default
            return;
        }

        const searchTerm = query.toLowerCase();
        const newResults: SearchResult[] = [];

        // Search products
        const matchingProducts = products
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.barcode.includes(searchTerm) ||
                p.sku.includes(searchTerm)
            )
            .slice(0, 5)
            .map(p => ({
                id: `product_${p.id}`,
                type: 'product' as const,
                title: p.name,
                subtitle: `${p.barcode} • Stock: ${p.stock} • ${p.sellingPrice} DA`,
                icon: <span style={{ fontSize: '18px' }}>{p.emoji}</span>,
                url: `/inventory?search=${encodeURIComponent(p.name)}`,
            }));

        newResults.push(...matchingProducts);

        // Search pages
        const matchingPages = PAGES.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.subtitle?.toLowerCase().includes(searchTerm)
        );

        newResults.push(...matchingPages);

        setResults(newResults.slice(0, 10));
        setSelectedIndex(0);
    }, [query, products]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, results.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    const handleSelect = (result: SearchResult) => {
        if (result.url) {
            navigate(result.url);
        }
        if (result.action) {
            result.action();
        }
        setQuery('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                {/* Search Input */}
                <div className={styles.searchHeader}>
                    <Search size={20} className={styles.searchIcon} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Rechercher produits, pages, clients..."
                        className={styles.searchInput}
                    />
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                {/* Results */}
                <div className={styles.results}>
                    {results.length === 0 ? (
                        <div className={styles.noResults}>
                            <Search size={40} />
                            <p>Aucun résultat pour "{query}"</p>
                        </div>
                    ) : (
                        results.map((result, index) => (
                            <button
                                key={result.id}
                                className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                                onClick={() => handleSelect(result)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                <div className={styles.resultIcon}>
                                    {result.icon}
                                </div>
                                <div className={styles.resultContent}>
                                    <span className={styles.resultTitle}>{result.title}</span>
                                    {result.subtitle && (
                                        <span className={styles.resultSubtitle}>{result.subtitle}</span>
                                    )}
                                </div>
                                <span className={styles.resultType}>
                                    {result.type === 'product' ? 'Produit' :
                                        result.type === 'page' ? 'Page' :
                                            result.type === 'customer' ? 'Client' : 'Action'}
                                </span>
                                <ChevronRight size={16} className={styles.arrow} />
                            </button>
                        ))
                    )}
                </div>

                {/* Keyboard hints */}
                <div className={styles.footer}>
                    <div className={styles.hint}>
                        <kbd>↑</kbd><kbd>↓</kbd> Naviguer
                    </div>
                    <div className={styles.hint}>
                        <kbd>⏎</kbd> Sélectionner
                    </div>
                    <div className={styles.hint}>
                        <kbd>Esc</kbd> Fermer
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
