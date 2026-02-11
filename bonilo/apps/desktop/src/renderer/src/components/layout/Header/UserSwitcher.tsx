import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    RefreshCw,
    Shield,
    Lock,
    Key,
    X,
} from 'lucide-react';
import { useAuthStore, PREDEFINED_USERS } from '@bonilo/shared/stores';
import styles from './UserSwitcher.module.css';

export const UserSwitcher: React.FC = () => {
    const {
        user: currentUser,
        activeSessions,
        switchUser,
        endSession
    } = useAuthStore();

    const [isOpen, setIsOpen] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSwitchInitiate = (user: any) => {
        if (user.id === currentUser?.id) return;
        setSelectedUser(user);
        setIsSwitching(true);
        setPassword('');
        setError('');
    };

    const handleSwitchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await switchUser(selectedUser.id, password);
        if (success) {
            setIsSwitching(false);
            setIsOpen(false);
        } else {
            setError('Mot de passe incorrect');
        }
    };

    return (
        <div className={styles.container}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                title="Changer d'utilisateur"
            >
                <Users size={18} />
                {activeSessions.length > 1 && (
                    <span className={styles.badge}>{activeSessions.length}</span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3>Sessions actives</h3>
                        <button onClick={() => setIsOpen(false)}><X size={16} /></button>
                    </div>

                    <div className={styles.sessionList}>
                        {activeSessions.map(session => (
                            <div
                                key={session.userId}
                                className={`${styles.sessionItem} ${session.userId === currentUser?.id ? styles.active : ''}`}
                                onClick={() => session.userId !== currentUser?.id && handleSwitchInitiate({ id: session.userId, name: session.userName })}
                            >
                                <div className={styles.avatar}>
                                    {session.userName.charAt(0)}
                                </div>
                                <div className={styles.info}>
                                    <span className={styles.name}>{session.userName}</span>
                                    <span className={styles.role}>{session.userRole}</span>
                                </div>
                                {session.isActive && <div className={styles.dot} />}
                            </div>
                        ))}
                    </div>

                    <div className={styles.divider} />
                    <div className={styles.sectionTitle}>Autres utilisateurs</div>

                    <div className={styles.userList}>
                        {PREDEFINED_USERS
                            .filter(u => !activeSessions.some(s => s.userId === u.id))
                            .map(u => (
                                <button
                                    key={u.id}
                                    className={styles.userItem}
                                    onClick={() => handleSwitchInitiate(u)}
                                >
                                    <div className={styles.avatarMini}>{u.firstName.charAt(0)}</div>
                                    <span>{u.firstName} {u.lastName}</span>
                                </button>
                            ))
                        }
                    </div>
                </div>
            )}

            {isSwitching && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <Lock size={20} />
                            <h3>Connexion rapide</h3>
                        </div>
                        <p>Veuillez entrer le mot de passe pour <strong>{selectedUser?.name || selectedUser?.firstName}</strong></p>

                        <form onSubmit={handleSwitchSubmit}>
                            <div className={styles.inputGroup}>
                                <Key size={18} />
                                <input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                />
                            </div>

                            {error && <span className={styles.error}>{error}</span>}

                            <div className={styles.actions}>
                                <button type="button" onClick={() => setIsSwitching(false)}>Annuler</button>
                                <button type="submit" className={styles.submitBtn}>
                                    <RefreshCw size={16} className={false ? styles.spinning : ''} />
                                    Changer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
