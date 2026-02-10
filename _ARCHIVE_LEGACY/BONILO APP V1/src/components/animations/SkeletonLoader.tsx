import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
    variant?: 'rect' | 'circle' | 'text';
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
    count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'rect',
    width,
    height,
    borderRadius,
    className = '',
    count = 1,
}) => {
    const getStyle = (): React.CSSProperties => {
        const style: React.CSSProperties = {};

        if (width) style.width = typeof width === 'number' ? `${width}px` : width;
        if (height) style.height = typeof height === 'number' ? `${height}px` : height;
        if (borderRadius) style.borderRadius = borderRadius;

        if (variant === 'circle') {
            const size = width || height || 40;
            style.width = typeof size === 'number' ? `${size}px` : size;
            style.height = typeof size === 'number' ? `${size}px` : size;
            style.borderRadius = '50%';
        }

        if (variant === 'text') {
            style.height = height || '14px';
            style.borderRadius = '4px';
            style.width = width || '100%';
        }

        return style;
    };

    const skeletonClass = `${styles.skeleton} ${className}`;

    if (count > 1) {
        return (
            <div className={styles.skeletonGroup}>
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className={skeletonClass}
                        style={{
                            ...getStyle(),
                            ...(variant === 'text' && i === count - 1 ? { width: '60%' } : {}),
                        }}
                    />
                ))}
            </div>
        );
    }

    return <div className={skeletonClass} style={getStyle()} />;
};

export default SkeletonLoader;
