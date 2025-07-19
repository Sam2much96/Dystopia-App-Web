import { defineConfig } from 'vite';


export default defineConfig({
    base: "", //ensures relative paths for itchio hosting
    build: {
        ssr: false, // Ensure no server-side rendering
        outDir: 'dist',
        rollupOptions: {
            external: [], //'three', 'littlejs','howler'

        },
        
    },

    server: {
        port: 3000 // or any desired port
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
