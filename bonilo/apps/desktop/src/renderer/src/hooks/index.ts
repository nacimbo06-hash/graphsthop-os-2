/**
 * Custom Hooks - Barrel Export
 * 
 * Reusable React hooks for common patterns.
 */

export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useOnClickOutside } from './useOnClickOutside';
export { usePrevious } from './usePrevious';
export { useInterval } from './useInterval';
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from './useMediaQuery';
export { useEventCallback, useDebouncedMemo, useIsFirstRender, useShallowMemo } from './usePerformance';

// API Hooks
export * from './useApi';
