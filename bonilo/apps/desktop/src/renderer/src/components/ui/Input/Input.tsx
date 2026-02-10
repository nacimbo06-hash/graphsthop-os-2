import React, { forwardRef } from 'react';
import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    hint?: string;
    size?: InputSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    error,
    hint,
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    disabled,
    id,
    ...props
}, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const wrapperClasses = [
        styles.wrapper,
        fullWidth ? styles.fullWidth : '',
        className,
    ].filter(Boolean).join(' ');

    const inputContainerClasses = [
        styles.inputContainer,
        styles[size],
        leftIcon ? styles.hasLeftIcon : '',
        rightIcon ? styles.hasRightIcon : '',
        error ? styles.error : '',
        disabled ? styles.disabled : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}

            <div className={inputContainerClasses}>
                {leftIcon && (
                    <span className={styles.leftIcon}>{leftIcon}</span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    className={styles.input}
                    disabled={disabled}
                    {...props}
                />

                {rightIcon && (
                    <span className={styles.rightIcon}>{rightIcon}</span>
                )}
            </div>

            {(error || hint) && (
                <span className={`${styles.message} ${error ? styles.errorMessage : ''}`}>
                    {error || hint}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
