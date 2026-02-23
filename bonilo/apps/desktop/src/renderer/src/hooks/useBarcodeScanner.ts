/**
 * useBarcodeScanner — Global Barcode Scanner Hook
 * 
 * Detects USB/Bluetooth barcode scanners by analyzing keystroke timing.
 * Scanners fire rapid keystrokes (< 50ms between chars) followed by Enter.
 * Human typing is much slower (> 100ms between chars).
 * 
 * This hook captures input globally — no need to focus on any input field.
 * It works across all pages of the app.
 * 
 * Usage:
 *   useBarcodeScanner((barcode) => {
 *     console.log('Scanned:', barcode);
 *     // Look up product, add to cart, etc.
 *   });
 */

import { useEffect, useRef, useCallback } from 'react';

interface ScannerOptions {
    /** Max ms between keystrokes to consider it a scanner (default: 50) */
    maxKeystrokeGap?: number;
    /** Min length of scanned code to be valid (default: 4) */
    minCodeLength?: number;
    /** Whether the scanner is enabled (default: true) */
    enabled?: boolean;
    /** Prevent default on captured scan events (default: true) */
    preventDefault?: boolean;
}

const DEFAULT_OPTIONS: Required<ScannerOptions> = {
    maxKeystrokeGap: 50,
    minCodeLength: 4,
    enabled: true,
    preventDefault: true,
};

export function useBarcodeScanner(
    onScan: (barcode: string) => void,
    options?: ScannerOptions
) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const bufferRef = useRef<string>('');
    const lastKeystrokeRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onScanRef = useRef(onScan);

    // Keep callback ref fresh without re-registering the listener
    useEffect(() => {
        onScanRef.current = onScan;
    }, [onScan]);

    const resetBuffer = useCallback(() => {
        bufferRef.current = '';
        lastKeystrokeRef.current = 0;
    }, []);

    useEffect(() => {
        if (!opts.enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const now = Date.now();
            const target = e.target as HTMLElement;
            const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            // If Enter is pressed, check if the buffer contains a valid scan
            if (e.key === 'Enter') {
                const code = bufferRef.current.trim();

                if (code.length >= opts.minCodeLength) {
                    // This looks like a scanner input — fire the callback
                    if (opts.preventDefault) {
                        e.preventDefault();
                        e.stopPropagation();
                    }

                    onScanRef.current(code);
                    resetBuffer();

                    // Clear any pending timeout
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                    return;
                }

                // Not enough chars — probably just human pressing Enter
                resetBuffer();
                return;
            }

            // Ignore modifier keys, function keys, and non-printable keys
            if (
                e.key.length !== 1 || // Non-printable (Shift, Ctrl, etc.)
                e.ctrlKey ||
                e.altKey ||
                e.metaKey
            ) {
                return;
            }

            const timeSinceLastKey = now - lastKeystrokeRef.current;

            // If too much time has passed since the last keystroke, reset
            // This means the previous buffer was from human typing
            if (lastKeystrokeRef.current > 0 && timeSinceLastKey > opts.maxKeystrokeGap) {
                // If the user is typing in an input, let it pass through normally
                if (isInputFocused) {
                    resetBuffer();
                    return;
                }
                resetBuffer();
            }

            // Add char to buffer
            bufferRef.current += e.key;
            lastKeystrokeRef.current = now;

            // If we're NOT in an input field and the buffer is growing fast,
            // prevent the char from appearing in any focused element
            if (!isInputFocused && bufferRef.current.length > 2 && opts.preventDefault) {
                e.preventDefault();
            }

            // Set a timeout to auto-clear the buffer if no more chars come
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                resetBuffer();
            }, opts.maxKeystrokeGap * 3); // Give 3x the gap before clearing
        };

        // Use capture phase to intercept before React handlers
        window.addEventListener('keydown', handleKeyDown, { capture: true });

        return () => {
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [opts.enabled, opts.maxKeystrokeGap, opts.minCodeLength, opts.preventDefault, resetBuffer]);
}

export default useBarcodeScanner;
