/**
 * Feature flags.
 *
 * Multi-PC network sync is built but not shipping in v1: the sync client
 * (`services/syncClient.ts`) is a mock that always reports offline. The code
 * stays, but every user-facing sync surface is hidden behind this flag so the
 * app doesn't advertise a feature it can't deliver yet. Flip to `true` to bring
 * the sync UI back.
 */
export const SYNC_UI_ENABLED = false;
