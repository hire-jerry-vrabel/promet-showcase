import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  // Deploy to: hire-jerry-vrabel.github.io/promet-showcase
  base: '/promet-showcase/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Promet Showcase',
        short_name: 'Promet',
        description:
          'A decoupled Drupal 10 + React 19 PWA demonstrating JSON:API consumption, ' +
          'custom REST resources, and offline-capable progressive web app architecture.',
        theme_color: '#1a56db',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/promet-showcase/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Cache API responses for 24 hours; stale-while-revalidate for assets.
        runtimeCaching: [
          {
            urlPattern: /\/api\/promet-showcase/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'drupal-api-cache',
              expiration: { maxAgeSeconds: 86_400 },
            },
          },
        ],
      },
    }),
  ],
});
