import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
    // Plugin mock desabilitado - usando backend real
    /*
    {
      name: 'mock-api',
      configureServer(server) {
        server.middlewares.use('/api/blender/test', (req, res, next) => {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              blenderAvailable: true,
              message: 'Blender is available (mock response)'
            }));
          } else {
            next();
          }
        });

        server.middlewares.use('/api/blender/preview', (req, res, next) => {
          if (req.method === 'POST') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: 'Backend server not running. Please start with: npm run dev'
            }));
          } else {
            next();
          }
        });
      }
    }
    */
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  // publicDir usa o padrão: client/public  
  assetsInclude: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2'], // Inclui arquivos de fonte como assets
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: false, // Permite acesso aos arquivos de fonte
      allow: [".."],
    },
    hmr: {
      overlay: false, // desativa o modal de erro no navegador
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
        timeout: 30000, // 30 segundos de timeout
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.error('🔴 Proxy error:', err.message);
            console.error('🔴 Request URL:', req.url);
            console.error('🔴 Target:', 'http://localhost:5002');
            
            if (!res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              });
              res.end(JSON.stringify({
                success: false,
                error: 'Backend server not available. Please run: npm run dev:back',
                details: err.message
              }));
            }
          });
          
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🟡 Proxy request:', req.method, req.url);
          });
          
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('🟢 Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
});
