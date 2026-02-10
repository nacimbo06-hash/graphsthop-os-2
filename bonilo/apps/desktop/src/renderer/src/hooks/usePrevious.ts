/**
 * usePrevious - Track previous value of a variable
 * 
 * Useful for comparing current and previous states.
 */

import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

export default usePrevious;
