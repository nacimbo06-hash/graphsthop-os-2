import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    // Tauri expects a fixed port, fail if that port is not available
    server: {
        port: 5173,
        strictPort: false,
        host: true,
    },

    // Build configuration for Tauri
    build: {
        // Tauri expects build output to be in `dist`
        outDir: 'dist',
        // Don't inline assets smaller than 0 bytes (Tauri handles assets)
        assetsInlineLimit: 4096,
        // Produce sourcemaps for debugging
        sourcemap: process.env.TAURI_DEBUG ? 'inline' : false,
        // Minify for production with esbuild
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        target: ['es2021', 'chrome100', 'safari15'],
        // Optimize bundle size with manual chunks
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor libraries for better caching
                    vendor: ['react', 'react-dom'],
                    // Separate chart libraries for dynamic loading
                    charts: ['recharts'],
                    // Separate PDF libraries
                    pdf: ['jspdf', 'jspdf-autotable'],
                    // Separate routing library
                    router: ['react-router-dom'],
                    // Separate state management
                    state: ['zustand'],
                    // Separate UI libraries
                    ui: ['lucide-react'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },

    // Optimize dependencies
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'zustand',
            'lucide-react',
            'recharts',
            'react-router-dom',
        ],
    },

    // Resolve aliases
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/renderer/src'),
            '@renderer': path.resolve(__dirname, './src/renderer/src'),
            '@bonilo/shared': path.resolve(__dirname, '../../packages/shared'),
            '@asgard/shared': path.resolve(__dirname, '../../packages/shared'),
        },
    },

    // Environment variables prefixed with TAURI_ are exposed
    envPrefix: ['VITE_', 'TAURI_'],

    // Clear screen on rebuild
    clearScreen: false,
})
