/**
 * @asgard/shared - Central export point for all shared modules
 * 
 * This package provides the "Source of Truth" for:
 * - TypeScript types and interfaces
 * - Zustand stores (state management)
 * - Application constants and configuration
 */

// Re-export all types
export * from './types';

// Re-export all constants
export * from './constants';

// Re-export sync client for stores
export { getSyncClient } from './services/syncClient';

// Re-export secure storage
export { secureStorage } from './utils/secureStorage';

// Stores should be imported individually to avoid bundle bloat
// Example: import { useProductsStore } from '@asgard/shared/stores'
