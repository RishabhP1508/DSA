import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), {name:'dsa-dev-bootstrap',configureServer(server){server.middlewares.use((req,res,next)=>{if(req.url==='/app-config.js'){res.setHeader('Content-Type','text/javascript');res.end('/* Local Vite development; packaged builds use the isolated runner. */');}else next();});}}],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // Bind dev/preview to loopback only (offline, local-first). The packaged
  // Windows build (Phase 5) serves the built assets from a local static server.
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  worker: {
    // The run worker is an ES module worker.
    format: 'es',
  },
  build: { rollupOptions: { input: { app: 'index.html', runner: 'runner-bridge.html' } } },
  // Pyodide is served from /public/pyodide (not bundled), so keep Vite from
  // trying to pre-bundle or resolve it.
  optimizeDeps: {
    exclude: ['pyodide'],
  },
})
