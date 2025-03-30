import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        server.middlewares.use((_, res, next) => {
          res.setHeader('Content-Security-Policy', `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https:;
            connect-src 'self' https://koyimcgjaoqxvwyscwaz.supabase.co https://*.supabase.co wss://koyimcgjaoqxvwyscwaz.supabase.co;
            font-src 'self';
          `.replace(/\s+/g, ' ').trim());
          next();
        });
      }
    }
  ],
  base: './',
  root: path.join(__dirname, 'src/renderer'),
  build: {
    outDir: path.join(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.join(__dirname, 'src/renderer/index.html')
      }
    }
  },
  server: {
    port: 5173
  },
  css: {
    postcss: './postcss.config.js'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src/renderer')
    }
  },
  optimizeDeps: {
    exclude: ['electron']
  },
  define: {
    'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
}); 