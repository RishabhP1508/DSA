import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Bind dev/preview to loopback only (offline, local-first). The packaged
  // Windows build (Phase 5) serves the built assets from a local static server.
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  worker: {
    // The run worker is an ES module worker.
    format: 'es',
  },
  // Pyodide is served from /public/pyodide (not bundled), so keep Vite from
  // trying to pre-bundle or resolve it.
  optimizeDeps: {
    exclude: ['pyodide'],
  },
})
