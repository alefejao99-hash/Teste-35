import express from 'express';
import path from 'path';

async function startServer() {
  const app = express();
  // Live in Square Cloud or other server port standard environment variables defaults to 3000
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API health checks or custom backend routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'Square Cloud Ready' });
  });

  // Automatically detect if running as pre-compiled bundle or explicitly marked as production
  const isProd = process.env.NODE_ENV === 'production' || 
                 (typeof __filename !== 'undefined' && !__filename.endsWith('.ts')) ||
                 path.basename(process.argv[1] || '').startsWith('server.cjs');

  // Serve with Vite Dev Middleware in local / development, or static assets in production
  if (isProd) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      // Dynamic import to prevent crash in production environments where devDependencies are not installed
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn('Vite not found or failed to load. Falling back to static file delivery:', err);
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is booted successfully on port ${PORT}!`);
  });
}

startServer();
