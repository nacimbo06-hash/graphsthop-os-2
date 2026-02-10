import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Edit2,
    Trash2,
    Key,
    Shield,
    UserCheck,
    UserX,
    Mail,
    Phone,
    AlertTriangle,
    X,
    Check,
    Eye,
    EyeOff,
    LayoutGrid,
} from 'lucide-react';
import {
    useAuthStore,
    ROLE_LABELS,
    MODULE_LABELS,
    ALL_MODULES,
    DEFAULT_MODULE_ACCESS
} from '@core/stores';
import type { User, UserRole, ModuleId } from '@core';
import { useToast } from '../../components/feedback/Toast';
import styles from './UsersManagement.module.css';

// Role colors for badges
const ROLE_COLORS: Record<UserRole, string> = {
    owner: '#8B5CF6',
    manager: '#3B82F6',
    cashier: '#10B981',
    stock_manager: '#F59E0B',
    accountant: '#EC4899',
};

// Role descriptions
const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
    owner: 'Accès total à toutes les fonctionnalités',
    manager: 'Gestion complète sauf utilisateurs',
    cashier: 'Accès au POS et ventes uniquement',
    stock_manager: 'Gestion des stocks et inventaire',
    accountant: 'Accès aux rapports et trésorerie',
};

interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    password: string;
    confirmPassword: string;
    isActive: boolean;
    moduleAccess: ModuleId[];
    useCustomAccess: boolean;
}

const initialFormData: UserFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'cashier',
    password: '',
    confirmPassword: '',
    isActive: true,
    moduleAccess: [],
    useCustomAccess: false,
};

export const UsersManagement: React.FC = () => {
    const { user: currentUser, allUsers, createUser, updateUser, deleteUser, hasPermission } = useAuthStore();
    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if current user can manage users
    const canManageUsers = hasPermission('manage_users');

    // Filter users
    const filteredUsers = allUsers.filter(u =>
        u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Update moduleAccess when role changes (if not using custom)
    useEffect(() => {
        if (!formData.useCustomAccess) {
            setFormData(prev => ({
                ...prev,
                moduleAccess: [...DEFAULT_MODULE_ACCESS[prev.role]]
            }));
        }
    }, [formData.role, formData.useCustomAccess]);

    const handleOpenAdd = () => {
        const newFormData = {
            ...initialFormData,
            moduleAccess: [...DEFAULT_MODULE_ACCESS['cashier']]
        };
        setFormData(newFormData);
        setError(null);
        setShowAddModal(true);
    };

    const handleOpenEdit = (user: User) => {
        setSelectedUser(user);
        const hasCustomAccess = user.moduleAccess && user.moduleAccess.length > 0;
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            password: '',
            confirmPassword: '',
            isActive: user.isActive,
            moduleAccess: hasCustomAccess ? [...user.moduleAccess!] : [...DEFAULT_MODULE_ACCESS[user.role]],
            useCustomAccess: !!hasCustomAccess,
        });
        setError(null);
        setShowEditModal(true);
    };

    const handleOpenPassword = (user: User) => {
        setSelectedUser(user);
        setFormData({ ...initialFormData, password: '', confirmPassword: '' });
        setError(null);
        setShowPasswordModal(true);
    };

    const handleOpenDelete = (user: User) => {
        setSelectedUser(user);
        setShowDeleteConfirm(true);
    };

    const handleToggleModule = (moduleId: ModuleId) => {
        setFormData(prev => {
            const newAccess = prev.moduleAccess.includes(moduleId)
                ? prev.moduleAccess.filter(m => m !== moduleId)
                : [...prev.moduleAccess, moduleId];
            return { ...prev, moduleAccess: newAccess, useCustomAccess: true };
        });
    };

    const handleResetToRoleDefaults = () => {
        setFormData(prev => ({
            ...prev,
            moduleAccess: [...DEFAULT_MODULE_ACCESS[prev.role]],
            useCustomAccess: false,
        }));
    };

    const handleAddUser = () => {
        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        const success = createUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            isActive: formData.isActive,
            twoFactorEnabled: false,
            password: formData.password,
            moduleAccess: formData.useCustomAccess ? formData.moduleAccess : undefined,
        });

        if (success) {
            setShowAddModal(false);
            setFormData(initialFormData);
            toast.success(`Utilisateur ${formData.firstName} créé avec succès`);
        } else {
            setError('Cet email est déjà utilisé');
            toast.error('Erreur lors de la création');
        }
    };

    const handleUpdateUser = () => {
        if (!selectedUser) return;

        if (!formData.firstName || !formData.lastName || !formData.email) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        updateUser(selectedUser.id, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            isActive: formData.isActive,
            moduleAccess: formData.useCustomAccess ? formData.moduleAccess : undefined,
        });

        setShowEditModal(false);
        setSelectedUser(null);
        toast.success(`Utilisateur ${formData.firstName} mis à jour`);
    };

    const handleChangePassword = () => {
        if (!selectedUser) return;

        if (!formData.password || formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        toast.success('Mot de passe modifié avec succès!');
        setShowPasswordModal(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;

        deleteUser(selectedUser.id);
        setShowDeleteConfirm(false);
        setSelectedUser(null);
        toast.info('Utilisateur supprimé');
    };

    const handleToggleActive = (user: User) => {
        updateUser(user.id, { isActive: !user.isActive });
    };

    const getUserModuleCount = (user: User) => {
        if (user.role === 'owner') return ALL_MODULES.length;
        if (user.moduleAccess && user.moduleAccess.length > 0) {
            return user.moduleAccess.length;
        }
        return DEFAULT_MODULE_ACCESS[user.role].length;
    };

    if (!canManageUsers) {
        return (
            <div className={styles.accessDenied}>
                <Shield size={48} />
                <h2>Accès refusé</h2>
                <p>Vous n'avez pas les permissions nécessaires pour gérer les utilisateurs.</p>
            </div>
        );
    }

    return (
        <div className={styles.usersManagement}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Users size={28} className={styles.headerIcon} />
                    <div>
                        <h1>Gestion des Utilisateurs</h1>
                        <p>{allUsers.length} utilisateur{allUsers.length > 1 ? 's' : ''} au total</p>
                    </div>
                </div>
                <button className={styles.addBtn} onClick={handleOpenAdd}>
                    <Plus size={18} />
                    Nouvel utilisateur
                </button>
            </div>

            {/* Search */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Roles Summary */}
            <div className={styles.rolesSummary}>
                {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => {
                    const count = allUsers.filter(u => u.role === role).length;
                    return (
                        <div key={role} className={styles.roleCard}>
                            <div
                                className={styles.roleColor}
                                style={{ backgroundColor: ROLE_COLORS[role] }}
                            />
                            <div className={styles.roleInfo}>
                                <span className={styles.roleName}>{ROLE_LABELS[role]}</span>
                                <span className={styles.roleCount}>{count}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Users List */}
            <div className={styles.usersList}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Utilisateur</th>
                            <th>Contact</th>
                            <th>Rôle</th>
                            <th>Modules</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className={!user.isActive ? styles.inactive : ''}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div
                                            className={styles.userAvatar}
                                            style={{ backgroundColor: ROLE_COLORS[user.role] }}
                                        >
                                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>
                                                {user.firstName} {user.lastName}
                                            </span>
                                            {user.id === currentUser?.id && (
                                                <span className={styles.currentBadge}>Vous</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.contactCell}>
                                        <span className={styles.email}>
                                            <Mail size={14} />
                                            {user.email}
                                        </span>
                                        {user.phone && (
                                            <span className={styles.phone}>
                                                <Phone size={14} />
                                                {user.phone}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span
                                        className={styles.roleBadge}
                                        style={{ backgroundColor: `${ROLE_COLORS[user.role]}20`, color: ROLE_COLORS[user.role] }}
                                    >
                                        <Shield size={12} />
                                        {ROLE_LABELS[user.role]}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles.moduleBadge}>
                                        <LayoutGrid size={12} />
                                        {getUserModuleCount(user)} / {ALL_MODULES.length}
                                        {user.moduleAccess && user.moduleAccess.length > 0 && (
                                            <span className={styles.customBadge}>Personnalisé</span>
                                        )}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className={`${styles.statusBtn} ${user.isActive ? styles.active : styles.inactive}`}
                                        onClick={() => handleToggleActive(user)}
                                        disabled={user.id === currentUser?.id}
                                    >
                                        {user.isActive ? (
                                            <>
                                                <UserCheck size={14} />
                                                Actif
                                            </>
                                        ) : (
                                            <>
                                                <UserX size={14} />
                                                Inactif
                                            </>
                                        )}
                                    </button>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleOpenEdit(user)}
                                            title="Modifier"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleOpenPassword(user)}
                                            title="Changer mot de passe"
                                        >
                                            <Key size={16} />
                                        </button>
                                        {user.id !== currentUser?.id && (
                                            <button
                                                className={`${styles.actionBtn} ${styles.danger}`}
                                                onClick={() => handleOpenDelete(user)}
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className={styles.modalOverlay} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{showAddModal ? 'Nouvel utilisateur' : 'Modifier utilisateur'}</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className={styles.formGrid}>
                                <div className={styles.formField}>
                                    <label>Prénom *</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        placeholder="Prénom"
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label>Nom *</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        placeholder="Nom"
                                    />
                                </div>
                            </div>

                            <div className={styles.formField}>
                                <label>Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@supermarket.dz"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+213 555 123 456"
                                />
                            </div>

                            <div className={styles.formField}>
                                <label>Rôle *</label>
                                <div className={styles.roleSelector}>
                                    {(Object.keys(ROLE_LABELS) as UserRole[]).map(role => (
                                        <button
                                            key={role}
                                            type="button"
                                            className={`${styles.roleOption} ${formData.role === role ? styles.selected : ''}`}
                                            onClick={() => setFormData({ ...formData, role })}
                                            style={{
                                                borderColor: formData.role === role ? ROLE_COLORS[role] : undefined,
                                                backgroundColor: formData.role === role ? `${ROLE_COLORS[role]}15` : undefined,
                                            }}
                                        >
                                            <span
                                                className={styles.roleOptionColor}
                                                style={{ backgroundColor: ROLE_COLORS[role] }}
                                            />
                                            <div className={styles.roleOptionContent}>
                                                <span className={styles.roleOptionName}>{ROLE_LABELS[role]}</span>
                                                <span className={styles.roleOptionDesc}>{ROLE_DESCRIPTIONS[role]}</span>
                                            </div>
                                            {formData.role === role && <Check size={18} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Module Access Section */}
                            {formData.role !== 'owner' && (
                                <div className={styles.formField}>
                                    <div className={styles.moduleAccessHeader}>
                                        <label>
                                            <LayoutGrid size={16} />
                                            Accès aux modules
                                        </label>
                                        {formData.useCustomAccess && (
                                            <button
                                                type="button"
                                                className={styles.resetBtn}
                                                onClick={handleResetToRoleDefaults}
                                            >
                                                Réinitialiser par défaut
                                            </button>
                                        )}
                                    </div>
                                    <p className={styles.moduleAccessInfo}>
                                        Cochez les modules auxquels cet utilisateur aura accès.
                                        {formData.useCustomAccess && (
                                            <span className={styles.customNote}> (Accès personnalisé)</span>
                                        )}
                                    </p>
                                    <div className={styles.moduleGrid}>
                                        {ALL_MODULES.filter(m => m !== 'users').map(moduleId => (
                                            <label
                                                key={moduleId}
                                                className={`${styles.moduleCheckbox} ${formData.moduleAccess.includes(moduleId) ? styles.checked : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.moduleAccess.includes(moduleId)}
                                                    onChange={() => handleToggleModule(moduleId)}
                                                />
                                                <span className={styles.checkboxMark}>
                                                    {formData.moduleAccess.includes(moduleId) && <Check size={14} />}
                                                </span>
                                                <span className={styles.moduleName}>{MODULE_LABELS[moduleId]}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {showAddModal && (
                                <>
                                    <div className={styles.formGrid}>
                                        <div className={styles.formField}>
                                            <label>Mot de passe *</label>
                                            <div className={styles.passwordInput}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Minimum 6 caractères"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.formField}>
                                            <label>Confirmer *</label>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                placeholder="Confirmer le mot de passe"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className={styles.formField}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <span>Compte actif</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                            >
                                Annuler
                            </button>
                            <button
                                className={styles.saveBtn}
                                onClick={showAddModal ? handleAddUser : handleUpdateUser}
                            >
                                {showAddModal ? 'Créer utilisateur' : 'Enregistrer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && selectedUser && (
                <div className={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
                    <div className={`${styles.modal} ${styles.smallModal}`} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Changer le mot de passe</h2>
                            <button className={styles.closeBtn} onClick={() => setShowPasswordModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {error && (
                                <div className={styles.errorMessage}>
                                    <AlertTriangle size={16} />
                                    {error}
                                </div>
                            )}

                            <p className={styles.passwordInfo}>
                                Modifier le mot de passe pour <strong>{selectedUser.firstName} {selectedUser.lastName}</strong>
                            </p>

                            <div className={styles.formField}>
                                <label>Nouveau mot de passe *</label>
                                <div className={styles.passwordInput}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Minimum 6 caractères"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.formField}>
                                <label>Confirmer le mot de passe *</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Confirmer le mot de passe"
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowPasswordModal(false)}>
                                Annuler
                            </button>
                            <button className={styles.saveBtn} onClick={handleChangePassword}>
                                <Key size={16} />
                                Changer le mot de passe
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && selectedUser && (
                <div className={styles.modalOverlay} onClick={() => setShowDeleteConfirm(false)}>
                    <div className={`${styles.modal} ${styles.smallModal} ${styles.dangerModal}`} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Supprimer l'utilisateur</h2>
                            <button className={styles.closeBtn} onClick={() => setShowDeleteConfirm(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.deleteWarning}>
                                <AlertTriangle size={40} />
                                <p>
                                    Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                                    <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ?
                                </p>
                                <p className={styles.deleteNote}>Cette action est irréversible.</p>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowDeleteConfirm(false)}>
                                Annuler
                            </button>
                            <button className={styles.deleteBtn} onClick={handleDeleteUser}>
                                <Trash2 size={16} />
                                Supprimer définitivement
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
