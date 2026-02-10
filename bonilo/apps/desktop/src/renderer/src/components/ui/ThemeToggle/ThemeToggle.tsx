import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@asgard/shared/stores';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
        >
            <div className={`${styles.iconWrapper} ${isDark ? styles.dark : ''}`}>
                <Sun size={18} className={styles.sunIcon} />
                <Moon size={18} className={styles.moonIcon} />
            </div>
        </button>
    );
};

export default ThemeToggle;
