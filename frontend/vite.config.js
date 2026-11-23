import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, todo lo que empiece con /api se redirige al backend Spring Boot (puerto 8080).
// Así el frontend llama a "/api/run" sin preocuparse por CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
