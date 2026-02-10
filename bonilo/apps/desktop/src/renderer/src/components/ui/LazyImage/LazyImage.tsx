/**
 * LazyImage Component
 * 
 * Lazy-loads images using Intersection Observer for better performance.
 * Only loads images when they enter the viewport.
 */

import React, { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string;
    placeholderSrc?: string;
    fallbackSrc?: string;
    threshold?: number;
    rootMargin?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%231e293b" width="100" height="100"/%3E%3C/svg%3E',
    fallbackSrc,
    threshold = 0.1,
    rootMargin = '50px',
    alt = '',
    style,
    className,
    ...rest
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
        if (fallbackSrc) {
            setIsLoaded(true);
        }
    };

    const currentSrc = hasError && fallbackSrc
        ? fallbackSrc
        : isInView
            ? src
            : placeholderSrc;

    return (
        <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={className}
            style={{
                ...style,
                opacity: isLoaded ? 1 : 0.5,
                transition: 'opacity 0.3s ease-in-out',
            }}
            {...rest}
        />
    );
};

export default LazyImage;
