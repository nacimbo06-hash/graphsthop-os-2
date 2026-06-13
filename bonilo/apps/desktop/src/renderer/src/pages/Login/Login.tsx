import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    ArrowRight,
    Shield,
} from 'lucide-react';
import { useAuthStore, ROLE_LABELS } from '@bonilo/shared/stores';
import styles from './Login.module.css';
import igoLogo from '../../assets/igo-logo.svg';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, loginError, allUsers } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    // Use actual registered users for quick login
    const registeredUsers = allUsers.map(user => ({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }));

    const handleQuickLogin = (userEmail: string) => {
        setEmail(userEmail);
        setPassword('');
    };

    return (
        <div className={styles.loginPage}>
            {/* Left Panel - Branding */}
            <div className={styles.brandPanel}>
                <div className={styles.brandContent}>
                    <div className={styles.logo}>
                        <img src={igoLogo} alt="Bonilo" style={{ width: 48, height: 48 }} />
                        <span>Bonilo</span>
                    </div>
                    <h1>Votre partenaire intelligent de gestion commerciale</h1>
                    <p>
                        Gérez votre inventaire, vos ventes, et vos clients avec une solution
                        moderne et adaptée au marché algérien.
                    </p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📊</span>
                            <span>Tableau de bord en temps réel</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>💰</span>
                            <span>Caisse (POS) rapide et intuitive</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📦</span>
                            <span>Gestion des stocks automatisée</span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🤖</span>
                            <span>Prévisions IA & calendrier algérien</span>
                        </div>
                    </div>
                </div>

                <div className={styles.brandFooter}>
                    <p>© 2026 Bonilo • Conçu pour l'Algérie 🇩🇿</p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className={styles.formPanel}>
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2>Connexion</h2>
                        <p>Bienvenue ! Connectez-vous pour continuer.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Error Message */}
                        {loginError && (
                            <div className={styles.error}>
                                <AlertCircle size={18} />
                                <span>{loginError}</span>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className={styles.field}>
                            <label htmlFor="email">Adresse email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre@email.dz"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className={styles.field}>
                            <label htmlFor="password">Mot de passe</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className={styles.options}>
                            <label className={styles.checkbox}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className={styles.checkmark}></span>
                                <span>Se souvenir de moi</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={isLoading || !email || !password}
                        >
                            {isLoading ? (
                                <span className={styles.spinner}></span>
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Registered Users for Quick Login */}
                    {registeredUsers.length > 0 && (
                        <div className={styles.demoSection}>
                            <div className={styles.demoHeader}>
                                <Shield size={16} />
                                <span>Comptes enregistrés</span>
                            </div>
                            <div className={styles.demoAccounts}>
                                {registeredUsers.map((user) => (
                                    <button
                                        key={user.email}
                                        type="button"
                                        className={styles.demoAccount}
                                        onClick={() => handleQuickLogin(user.email)}
                                    >
                                        <span className={styles.demoRole}>
                                            {ROLE_LABELS[user.role]}
                                        </span>
                                        <span className={styles.demoEmail}>{user.email}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
