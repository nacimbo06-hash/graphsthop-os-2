import React, { useState } from 'react';
import {
    HelpCircle,
    BookOpen,
    MessageCircle,
    Keyboard,
    Info,
    ChevronDown,
    ChevronRight,
    Search,
    Mail,
    Phone,
    Send,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Play,
    FileText,
    ShoppingCart,
    Package,
    Users,
    DollarSign,
    BarChart3,
    Settings,
    Printer,
    ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Help.module.css';

// FAQ Data
const faqCategories = [
    {
        id: 'pos',
        name: 'Point de Vente (Caisse)',
        icon: '🛒',
        questions: [
            {
                q: "Comment ajouter un produit au panier?",
                a: "Scannez le code-barres du produit ou utilisez la recherche en haut de l'écran. Vous pouvez aussi cliquer sur les produits dans la grille. Les produits favoris apparaissent en premier pour un accès rapide."
            },
            {
                q: "Comment appliquer une remise?",
                a: "Cliquez sur le bouton 'Remise' en bas du panier, puis entrez le pourcentage de remise souhaité (0-100%). La remise sera appliquée au sous-total."
            },
            {
                q: "Comment mettre une vente en attente?",
                a: "Cliquez sur le bouton 'Attente' pour mettre la vente en pause. Vous pouvez ensuite la reprendre plus tard en cliquant sur 'Ventes en attente'."
            },
            {
                q: "Comment annuler une vente?",
                a: "Cliquez sur le bouton 'Annuler' pour vider le panier complètement. Une confirmation vous sera demandée."
            },
            {
                q: "Comment changer le mode de paiement?",
                a: "Dans la fenêtre de paiement, sélectionnez le mode souhaité: Espèces, CIB, Dahabia ou Crédit client."
            },
        ]
    },
    {
        id: 'inventory',
        name: 'Gestion de Stock',
        icon: '📦',
        questions: [
            {
                q: "Comment ajouter un nouveau produit?",
                a: "Allez dans Inventaire > Ajouter Produit. Remplissez les informations: nom, catégorie, prix d'achat, prix de vente, stock initial et stock minimum."
            },
            {
                q: "Comment recevoir une livraison?",
                a: "Allez dans Inventaire > Réception. Scannez ou recherchez les produits, entrez les quantités reçues (en packs ou unités), puis validez la réception."
            },
            {
                q: "Que signifient les alertes de stock?",
                a: "Rouge = Rupture de stock (0 unités). Orange = Stock bas (en dessous du minimum). Jaune = Produit proche de la date de péremption."
            },
            {
                q: "Comment faire un inventaire?",
                a: "Allez dans Inventaire > Inventaire. Vous pouvez compter les produits par catégorie ou scanner chaque produit pour vérifier les quantités réelles."
            },
        ]
    },
    {
        id: 'treasury',
        name: 'Trésorerie',
        icon: '💰',
        questions: [
            {
                q: "Comment ouvrir la caisse?",
                a: "Cliquez sur 'Ouvrir la caisse' et entrez le montant du fond de caisse (argent liquide au démarrage)."
            },
            {
                q: "Comment enregistrer une dépense?",
                a: "Cliquez sur 'Nouvelle dépense', sélectionnez la catégorie, entrez le montant et la description."
            },
            {
                q: "Comment clôturer la caisse?",
                a: "Cliquez sur 'Clôturer', comptez l'argent réel dans la caisse et entrez le montant. Le système calculera automatiquement l'écart."
            },
            {
                q: "Qu'est-ce que le rapport Z?",
                a: "Le rapport Z est le récapitulatif de fin de journée avec toutes les ventes, dépenses et mouvements de caisse. Il peut être imprimé."
            },
        ]
    },
    {
        id: 'customers',
        name: 'Clients & Fidélité',
        icon: '👥',
        questions: [
            {
                q: "Comment créer un compte client?",
                a: "Allez dans Clients > Nouveau client. Remplissez le nom, téléphone (optionnel) et type de client (Particulier/Professionnel)."
            },
            {
                q: "Comment fonctionne le crédit client?",
                a: "Un client avec un compte peut acheter à crédit. Le solde dû apparaît dans sa fiche. Vous pouvez enregistrer des paiements partiels."
            },
            {
                q: "Comment fonctionne la fidélité?",
                a: "Les clients accumulent des points à chaque achat (1 point = 100 DA). Les points peuvent être échangés contre des remises."
            },
        ]
    },
    {
        id: 'settings',
        name: 'Paramètres',
        icon: '⚙️',
        questions: [
            {
                q: "Comment changer le taux de TVA?",
                a: "Allez dans Paramètres > Magasin. Vous pouvez activer/désactiver la TVA et choisir le taux (9% ou 19%)."
            },
            {
                q: "Comment configurer l'imprimante?",
                a: "Allez dans Paramètres > Impression. Sélectionnez votre imprimante thermique et configurez la largeur du papier (58mm ou 80mm)."
            },
            {
                q: "Comment sauvegarder mes données?",
                a: "Allez dans Paramètres > Sauvegarde. Vous pouvez exporter les paramètres et les données vers un fichier JSON."
            },
        ]
    },
];

// Keyboard shortcuts
const keyboardShortcuts = [
    {
        category: 'Navigation', shortcuts: [
            { keys: ['Ctrl', 'P'], action: 'Ouvrir la Caisse (POS)' },
            { keys: ['Ctrl', 'I'], action: 'Inventaire' },
            { keys: ['Ctrl', 'T'], action: 'Trésorerie' },
            { keys: ['Ctrl', 'R'], action: 'Rapports' },
            { keys: ['Ctrl', ','], action: 'Paramètres' },
            { keys: ['Esc'], action: 'Fermer les modals' },
        ]
    },
    {
        category: 'Point de Vente', shortcuts: [
            { keys: ['F1'], action: 'Rechercher produit' },
            { keys: ['F2'], action: 'Appliquer remise' },
            { keys: ['F3'], action: 'Mettre en attente' },
            { keys: ['F4'], action: 'Reprendre vente' },
            { keys: ['F8'], action: 'Encaisser' },
            { keys: ['F10'], action: 'Annuler vente' },
            { keys: ['↑', '↓'], action: 'Parcourir les produits' },
            { keys: ['+', '-'], action: 'Modifier quantité' },
        ]
    },
    {
        category: 'Général', shortcuts: [
            { keys: ['Ctrl', 'S'], action: 'Sauvegarder' },
            { keys: ['Ctrl', 'Z'], action: 'Annuler' },
            { keys: ['Ctrl', 'F'], action: 'Rechercher' },
            { keys: ['Ctrl', 'H'], action: "Ouvrir l'aide" },
        ]
    },
];

// Module guides
const moduleGuides = [
    {
        id: 'pos',
        title: 'Point de Vente',
        icon: ShoppingCart,
        description: 'Encaissement rapide, gestion du panier, modes de paiement',
        color: '#3D7C4F',
        steps: [
            'Scanner ou rechercher les produits',
            'Ajuster les quantités si nécessaire',
            'Appliquer une remise (optionnel)',
            'Sélectionner le mode de paiement',
            'Confirmer et imprimer le ticket'
        ]
    },
    {
        id: 'inventory',
        title: 'Inventaire',
        icon: Package,
        description: 'Produits, stock, réceptions, alertes',
        color: '#34C759',
        steps: [
            'Ajouter et modifier les produits',
            'Recevoir les livraisons fournisseurs',
            'Suivre les niveaux de stock',
            'Gérer les dates de péremption',
            'Faire des inventaires réguliers'
        ]
    },
    {
        id: 'treasury',
        title: 'Trésorerie',
        icon: DollarSign,
        description: 'Caisse, dépenses, mouvements, rapports',
        color: '#FFD60A',
        steps: [
            'Ouvrir la caisse avec le fond initial',
            'Enregistrer les dépenses',
            'Suivre les entrées/sorties',
            'Clôturer la caisse en fin de journée',
            'Générer le rapport Z'
        ]
    },
    {
        id: 'customers',
        title: 'Clients',
        icon: Users,
        description: 'Comptes clients, crédit, fidélité',
        color: '#8B5CF6',
        steps: [
            'Créer des comptes clients',
            'Gérer le crédit client',
            'Suivre les points de fidélité',
            'Consulter l\'historique d\'achats'
        ]
    },
    {
        id: 'reports',
        title: 'Rapports & IA',
        icon: BarChart3,
        description: 'Analyses, prévisions, intelligence artificielle',
        color: '#06B6D4',
        steps: [
            'Consulter les ventes du jour/semaine/mois',
            'Analyser les tendances',
            'Voir les prévisions IA',
            'Exporter les rapports'
        ]
    },
    {
        id: 'settings',
        title: 'Paramètres',
        icon: Settings,
        description: 'Configuration du magasin et du système',
        color: '#6B7280',
        steps: [
            'Configurer les infos du magasin',
            'Régler la TVA et la devise',
            'Paramétrer l\'imprimante',
            'Gérer les sauvegardes'
        ]
    },
];

type TabId = 'faq' | 'guides' | 'shortcuts' | 'contact' | 'about';

export const Help: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabId>('faq');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
    const [expandedCategory, setExpandedCategory] = useState<string | null>('pos');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [contactSent, setContactSent] = useState(false);

    const tabs = [
        { id: 'faq' as TabId, label: 'FAQ', icon: HelpCircle },
        { id: 'guides' as TabId, label: 'Guides', icon: BookOpen },
        { id: 'shortcuts' as TabId, label: 'Raccourcis', icon: Keyboard },
        { id: 'contact' as TabId, label: 'Contact', icon: MessageCircle },
        { id: 'about' as TabId, label: 'À propos', icon: Info },
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        setContactSent(true);
        setTimeout(() => {
            setContactForm({ name: '', email: '', subject: '', message: '' });
            setContactSent(false);
        }, 3000);
    };

    // Filter FAQ based on search
    const filteredFaqs = faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(
            q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0 || searchQuery === '');

    return (
        <div className={styles.help}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backBtn} onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Aide & Support</h1>
                        <p>Trouvez des réponses à vos questions</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className={styles.tabNav}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* FAQ Tab */}
                {activeTab === 'faq' && (
                    <div className={styles.faqSection}>
                        {/* Search */}
                        <div className={styles.searchBar}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher dans la FAQ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* FAQ Categories */}
                        <div className={styles.faqList}>
                            {filteredFaqs.map(category => (
                                <div key={category.id} className={styles.faqCategory}>
                                    <button
                                        className={styles.categoryHeader}
                                        onClick={() => setExpandedCategory(
                                            expandedCategory === category.id ? null : category.id
                                        )}
                                    >
                                        <span className={styles.categoryIcon}>{category.icon}</span>
                                        <span className={styles.categoryName}>{category.name}</span>
                                        <span className={styles.questionCount}>
                                            {category.questions.length} questions
                                        </span>
                                        {expandedCategory === category.id
                                            ? <ChevronDown size={20} />
                                            : <ChevronRight size={20} />
                                        }
                                    </button>

                                    {expandedCategory === category.id && (
                                        <div className={styles.questionsList}>
                                            {category.questions.map((item, idx) => (
                                                <div key={idx} className={styles.faqItem}>
                                                    <button
                                                        className={styles.questionHeader}
                                                        onClick={() => setExpandedFaq(
                                                            expandedFaq === `${category.id}-${idx}`
                                                                ? null
                                                                : `${category.id}-${idx}`
                                                        )}
                                                    >
                                                        <HelpCircle size={16} />
                                                        <span>{item.q}</span>
                                                        {expandedFaq === `${category.id}-${idx}`
                                                            ? <ChevronDown size={16} />
                                                            : <ChevronRight size={16} />
                                                        }
                                                    </button>
                                                    {expandedFaq === `${category.id}-${idx}` && (
                                                        <div className={styles.answer}>
                                                            {item.a}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Guides Tab */}
                {activeTab === 'guides' && (
                    <div className={styles.guidesSection}>
                        <div className={styles.guidesGrid}>
                            {moduleGuides.map(guide => (
                                <div
                                    key={guide.id}
                                    className={styles.guideCard}
                                    style={{ '--guide-color': guide.color } as React.CSSProperties}
                                >
                                    <div className={styles.guideHeader}>
                                        <div className={styles.guideIcon}>
                                            <guide.icon size={24} />
                                        </div>
                                        <div>
                                            <h3>{guide.title}</h3>
                                            <p>{guide.description}</p>
                                        </div>
                                    </div>
                                    <div className={styles.guideSteps}>
                                        {guide.steps.map((step, idx) => (
                                            <div key={idx} className={styles.step}>
                                                <span className={styles.stepNumber}>{idx + 1}</span>
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className={styles.guideAction}>
                                        <Play size={16} />
                                        Voir le tutoriel
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Shortcuts Tab */}
                {activeTab === 'shortcuts' && (
                    <div className={styles.shortcutsSection}>
                        {keyboardShortcuts.map(category => (
                            <div key={category.category} className={styles.shortcutCategory}>
                                <h3>{category.category}</h3>
                                <div className={styles.shortcutsList}>
                                    {category.shortcuts.map((shortcut, idx) => (
                                        <div key={idx} className={styles.shortcutItem}>
                                            <div className={styles.keys}>
                                                {shortcut.keys.map((key, keyIdx) => (
                                                    <React.Fragment key={keyIdx}>
                                                        <kbd>{key}</kbd>
                                                        {keyIdx < shortcut.keys.length - 1 && <span>+</span>}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            <span className={styles.action}>{shortcut.action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <div className={styles.contactSection}>
                        <div className={styles.contactGrid}>
                            {/* Contact Form */}
                            <div className={styles.contactForm}>
                                <h3>Envoyer un message</h3>
                                {contactSent ? (
                                    <div className={styles.successMessage}>
                                        <CheckCircle size={48} />
                                        <h4>Message envoyé!</h4>
                                        <p>Nous vous répondrons dans les 24 heures.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContactSubmit}>
                                        <div className={styles.formRow}>
                                            <div className={styles.formGroup}>
                                                <label>Nom</label>
                                                <input
                                                    type="text"
                                                    value={contactForm.name}
                                                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                    placeholder="Votre nom"
                                                    required
                                                />
                                            </div>
                                            <div className={styles.formGroup}>
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                    placeholder="votre@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Sujet</label>
                                            <select
                                                value={contactForm.subject}
                                                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                                                required
                                            >
                                                <option value="">Sélectionner un sujet...</option>
                                                <option value="bug">Signaler un bug</option>
                                                <option value="feature">Demande de fonctionnalité</option>
                                                <option value="question">Question générale</option>
                                                <option value="billing">Facturation</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Message</label>
                                            <textarea
                                                value={contactForm.message}
                                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                placeholder="Décrivez votre problème ou question..."
                                                rows={5}
                                                required
                                            />
                                        </div>
                                        <button type="submit" className={styles.submitBtn}>
                                            <Send size={18} />
                                            Envoyer le message
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className={styles.contactInfo}>
                                <h3>Autres moyens de nous contacter</h3>
                                <div className={styles.contactCard}>
                                    <Mail size={24} />
                                    <div>
                                        <h4>Email</h4>
                                        <a href="mailto:support@igo.dz">support@igo.dz</a>
                                    </div>
                                </div>
                                <div className={styles.contactCard}>
                                    <Phone size={24} />
                                    <div>
                                        <h4>Téléphone</h4>
                                        <a href="tel:+213550123456">+213 550 123 456</a>
                                        <p>Lun-Ven 8h-18h</p>
                                    </div>
                                </div>
                                <div className={styles.contactCard}>
                                    <MessageCircle size={24} />
                                    <div>
                                        <h4>WhatsApp</h4>
                                        <a href="https://wa.me/213550123456" target="_blank" rel="noopener noreferrer">
                                            +213 550 123 456
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                </div>

                                <div className={styles.emergencyCard}>
                                    <AlertCircle size={20} />
                                    <div>
                                        <h4>Support Urgent</h4>
                                        <p>Pour les problèmes critiques affectant vos ventes, appelez directement.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className={styles.aboutSection}>
                        <div className={styles.aboutHeader}>
                            <div className={styles.appLogo}>
                                <span>🚀</span>
                            </div>
                            <h2>IGO</h2>
                            <p className={styles.version}>Version 1.0.0</p>
                        </div>

                        <div className={styles.aboutGrid}>
                            <div className={styles.aboutCard}>
                                <h3>À propos</h3>
                                <p>
                                    IGO est votre partenaire intelligent de gestion commerciale,
                                    conçu spécifiquement pour les supermarchés et épiceries en Algérie.
                                    Notre solution intègre la gestion des ventes, des stocks,
                                    de la trésorerie et des clients dans une interface moderne et intuitive.
                                </p>
                            </div>

                            <div className={styles.aboutCard}>
                                <h3>Fonctionnalités clés</h3>
                                <ul>
                                    <li>✓ Point de vente rapide avec scan de codes-barres</li>
                                    <li>✓ Gestion de stock en temps réel</li>
                                    <li>✓ Suivi des dates de péremption</li>
                                    <li>✓ Trésorerie et rapports financiers</li>
                                    <li>✓ Gestion des clients et fidélité</li>
                                    <li>✓ Prévisions IA et calendrier algérien</li>
                                    <li>✓ Fonctionne hors ligne</li>
                                </ul>
                            </div>

                            <div className={styles.aboutCard}>
                                <h3>Informations système</h3>
                                <div className={styles.sysInfo}>
                                    <div className={styles.sysRow}>
                                        <span>Version</span>
                                        <strong>1.0.0</strong>
                                    </div>
                                    <div className={styles.sysRow}>
                                        <span>Dernière mise à jour</span>
                                        <strong>4 Janvier 2026</strong>
                                    </div>
                                    <div className={styles.sysRow}>
                                        <span>Navigateur</span>
                                        <strong>{navigator.userAgent.split(' ').slice(-1)[0]}</strong>
                                    </div>
                                    <div className={styles.sysRow}>
                                        <span>Langue</span>
                                        <strong>Français</strong>
                                    </div>
                                    <div className={styles.sysRow}>
                                        <span>Mode</span>
                                        <strong>Production</strong>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.aboutCard}>
                                <h3>Liens utiles</h3>
                                <div className={styles.linksList}>
                                    <a href="#" className={styles.linkItem}>
                                        <FileText size={18} />
                                        Conditions d'utilisation
                                        <ExternalLink size={14} />
                                    </a>
                                    <a href="#" className={styles.linkItem}>
                                        <FileText size={18} />
                                        Politique de confidentialité
                                        <ExternalLink size={14} />
                                    </a>
                                    <a href="#" className={styles.linkItem}>
                                        <FileText size={18} />
                                        Notes de version
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className={styles.copyright}>
                            <p>© 2026 IGO. Tous droits réservés.</p>
                            <p>Développé avec ❤️ en Algérie</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Help;
