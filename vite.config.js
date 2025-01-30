import { defineConfig } from 'vite';
import VitePluginCdnImport from 'vite-plugin-cdn-import';
export default defineConfig({
    build: {
        ssr: false, // Ensure no server-side rendering
        outDir: 'build',
        rollupOptions: {
            external: ['howler', 'three', 'littlejs'],
        },
    },
    server: {
        port: 3000 // or any desired port
    },
    resolve: {
        extensions: ['.ts', '.js'] // Ensure .ts files are resolved
    },
    plugins: [
        VitePluginCdnImport({
            modules: [
                {
                    name: 'three',
                    var: 'THREE',
                    path: 'https://cdn.skypack.dev/three@0.133.0/build/three.module.js'
                },
                {
                    name: 'howler',
                    var: 'Howler',
                    path: 'https://www.unpkg.com/howler@2.1.3/dist/howler.min.js'
                },
                {
                    name: "littlejsengine",
                    var: "Littlejsengine",
                    path: "https://littlejs-static.vercel.app/js/littlejs.js"
                },
                {
                    name: "Zzfx",
                    var: "zzfx",
                    path: "https://littlejs-static.vercel.app/js/zzfx/ZzFX.js"
                },

            ]
        }),
    ],
});
