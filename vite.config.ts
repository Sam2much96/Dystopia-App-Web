import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';


export default defineConfig({
    base: "", //ensures relative paths for itchio hosting
    build: {
        assetsInlineLimit: 0,         // disables inlining
        chunkSizeWarningLimit: 900, // in KB
        ssr: false, // Ensure no server-side rendering
        outDir: 'dist',
        rollupOptions: {
            external: [],
            output: {
                manualChunks: undefined,  // disables code splitting
            }

        },
        
        
    },

    server: {
        host:'localhost',
        port: 3000, // or any desired port,
        cors: false,
        headers: {
            "cache-control" : "no-store",
        }
    },

    resolve: {
        extensions: ['.ts', '.js'], // Ensure .ts files are resolved
        alias: {
            buffer: 'buffer', // 👈 Ensures buffer works in the browser
        }

    },

    define: {
        global: 'window' // 👈 Fixes the "global is not defined" error
    },


});
