/**
 * useInterval - setInterval as a declarative hook
 * 
 * Properly handles cleanup and dynamic delay changes.
 */

import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null): void {
    const savedCallback = useRef<(() => void) | undefined>(undefined);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        if (delay === null) return;

        const tick = () => {
            savedCallback.current?.();
        };

        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

export default useInterval;
