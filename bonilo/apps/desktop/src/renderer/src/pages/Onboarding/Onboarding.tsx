import React, { useState } from 'react';
import {
    MapPin,
    CheckCircle,
    ArrowRight,
    Loader2,
    Shield,
    ChevronLeft,
    Sparkles,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './Onboarding.module.css';
import { useAuthStore } from '@bonilo/shared/stores';
import igoLogo from '../../assets/igo-logo.svg';

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { storeSettings, updateStoreSettings } = useSettings();
    const { createUser, login, allUsers } = useAuthStore();
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Redirect if already configured (both store AND users exist)
    React.useEffect(() => {
        if (storeSettings.name && allUsers.length > 0) {
            navigate('/', { replace: true });
        }
    }, [storeSettings.name, allUsers.length, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        nif: '',
        rc: '',
        currency: 'DZD',
        // Owner user fields
        ownerFirstName: '',
        ownerLastName: '',
        ownerEmail: '',
        ownerPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleComplete = async () => {
        setIsSaving(true);
        // Simulate a tiny bit of processing for the wow effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create the first owner user
        const ownerCreated = await createUser({
            email: formData.ownerEmail || `admin@${formData.name.toLowerCase().replace(/\s+/g, '')}.dz`,
            password: formData.ownerPassword || 'admin123',
            firstName: formData.ownerFirstName || 'Admin',
            lastName: formData.ownerLastName || formData.name,
            phone: formData.phone,
            role: 'owner',
            isActive: true,
            twoFactorEnabled: false,
        });

        if (ownerCreated) {
            // Auto-login with the created user
            await login(
                formData.ownerEmail || `admin@${formData.name.toLowerCase().replace(/\s+/g, '')}.dz`,
                formData.ownerPassword || 'admin123'
            );
        }

        // Save store settings
        updateStoreSettings({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            email: formData.email,
            nif: formData.nif,
            rc: formData.rc,
            currency: formData.currency,
            timezone: 'Africa/Algiers',
            tvaEnabled: true,
            tvaRate: 19
        });

        // Navigation handled by useEffect redirect
    };

    const steps = [
        { id: 1, title: 'Identité', label: 'Etape 01', icon: <Shield size={22} /> },
        { id: 2, title: 'Localisation', label: 'Etape 02', icon: <MapPin size={22} /> },
        { id: 3, title: 'Légal & Fiscal', label: 'Etape 03', icon: <Lock size={22} /> }
    ];

    return (
        <div className={styles.onboardingContainer}>
            <div className={styles.glowOrb} />

            <div className={styles.onboardingCard}>
                {isSaving && (
                    <div className={styles.loadingOverlay}>
                        <Loader2 className={styles.spin} size={48} />
                        <span className={styles.loadingText}>Initialisation d'IGO...</span>
                    </div>
                )}

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.logoArea}>
                        <img src={igoLogo} alt="IGO" style={{ height: 40, marginBottom: 8 }} />
                        <span className={styles.tagline}>Votre partenaire intelligent</span>
                    </div>

                    <div className={styles.steps}>
                        {steps.map((s) => (
                            <div
                                key={s.id}
                                className={`${styles.stepItem} ${step === s.id ? styles.active : ''} ${step > s.id ? styles.completed : ''}`}
                            >
                                <div className={styles.stepIcon}>
                                    {step > s.id ? <CheckCircle size={22} /> : s.icon}
                                </div>
                                <div className={styles.stepText}>
                                    <span className={styles.stepLabel}>{s.label}</span>
                                    <span className={styles.stepTitle}>{s.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                            <Lock size={12} />
                            <span>Données privées & sécurisées</span>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main className={styles.contentArea}>
                    {step === 1 && (
                        <div className={styles.stepContent}>
                            <header className={styles.stepHeader}>
                                <h2>Commençons par le début</h2>
                                <p>Donnez un nom et une voix à votre boutique.</p>
                            </header>

                            <div className={styles.formGrid}>
                                <div className={styles.inputField}>
                                    <label>Nom de l'établissement</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ex: Supermarché El Kods"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <label>Téléphone professionnel</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Ex: 0550 12 34 56"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <label>Email de contact (Optionnel)</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="contact@boutique.dz"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={styles.stepContent}>
                            <header className={styles.stepHeader}>
                                <h2>Où vous trouvez-vous ?</h2>
                                <p>Ces informations apparaîtront sur vos tickets de caisse.</p>
                            </header>

                            <div className={styles.formGrid}>
                                <div className={styles.inputField}>
                                    <label>Adresse physique</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Ex: 12 Rue des Martyrs"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <label>Ville / Wilaya</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Ex: Alger"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={styles.stepContent}>
                            <header className={styles.stepHeader}>
                                <h2>Dernière ligne droite</h2>
                                <p>Configurez vos mentions légales et votre compte propriétaire.</p>
                            </header>

                            <div className={styles.formGrid}>
                                <div className={styles.inputField}>
                                    <label>Registre du Commerce (RC)</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="rc"
                                            value={formData.rc}
                                            onChange={handleChange}
                                            placeholder="Ex: 16/00-1234567B01"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <label>Identification Fiscale (NIF)</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="nif"
                                            value={formData.nif}
                                            onChange={handleChange}
                                            placeholder="Ex: 000116012345678"
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: '1 / -1', marginTop: '1rem', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Lock size={18} style={{ color: '#3D7C4F' }} />
                                        <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Compte administrateur</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                                        Ces identifiants seront utilisés pour vous connecter.
                                    </p>
                                </div>

                                <div className={styles.inputField}>
                                    <label>Email administrateur *</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="ownerEmail"
                                            type="email"
                                            value={formData.ownerEmail}
                                            onChange={handleChange}
                                            placeholder="admin@votreboutique.dz"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <label>Mot de passe *</label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            name="ownerPassword"
                                            type="password"
                                            value={formData.ownerPassword}
                                            onChange={handleChange}
                                            placeholder="Minimum 6 caractères"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ gridColumn: '1 / -1', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1.5rem', borderRadius: '20px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Sparkles style={{ color: '#10b981' }} />
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                                        La devise sera fixée sur <strong>DZD (DA)</strong> et la TVA à <strong>19%</strong> par défaut.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <footer className={styles.footer}>
                        {step > 1 ? (
                            <button className={styles.btnBack} onClick={prevStep}>
                                <ChevronLeft size={20} /> Retour
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                className={styles.btnNext}
                                onClick={nextStep}
                                disabled={step === 1 && !formData.name}
                            >
                                Suivant <ArrowRight size={20} />
                            </button>
                        ) : (
                            <button
                                className={styles.btnNext}
                                onClick={handleComplete}
                                disabled={!formData.rc || !formData.nif}
                            >
                                Terminer <CheckCircle size={20} />
                            </button>
                        )}
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default Onboarding;
