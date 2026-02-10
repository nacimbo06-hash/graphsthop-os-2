/**
 * Performance Hooks - Memoization & Optimization Utilities
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Hook that returns a stable callback reference that always calls the latest callback.
 * Useful for event handlers in useEffect without causing re-runs.
 */
export function useEventCallback<T extends (...args: any[]) => any>(callback: T): T {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args: Parameters<T>) => {
        return callbackRef.current(...args);
    }, []) as T;
}

/**
 * Hook that returns a memoized value that only updates when the debounced value changes.
 * Useful for expensive computations based on search terms.
 */
export function useDebouncedMemo<T>(
    factory: () => T,
    deps: any[],
    delay: number = 300
): T {
    const debouncedDeps = useDebounce(deps, delay);
    return useMemo(factory, debouncedDeps);
}

/**
 * Hook to track if a component is mounting for the first time.
 * Useful to skip certain effects on initial render.
 */
export function useIsFirstRender(): boolean {
    const isFirst = useRef(true);

    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }

    return false;
}

/**
 * Hook that returns a stable object reference as long as values are shallow-equal.
 * Prevents unnecessary re-renders when object values haven't actually changed.
 */
export function useShallowMemo<T extends Record<string, any>>(value: T): T {
    const ref = useRef<T>(value);

    const isEqual = useMemo(() => {
        const keys = Object.keys(value);
        const prevKeys = Object.keys(ref.current);

        if (keys.length !== prevKeys.length) return false;

        return keys.every(key => ref.current[key] === value[key]);
    }, [value]);

    if (!isEqual) {
        ref.current = value;
    }

    return ref.current;
}
