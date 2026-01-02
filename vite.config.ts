import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // --- TAMBAHKAN BAGIAN INI ---
      devOptions: {
        enabled: true // Agar PWA jalan di localhost/npm run dev
      },
      // ----------------------------
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Gdrone Official Store',
        short_name: 'Gdrone',
        description: 'Pusat belanja drone premium terbaik di Indonesia',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/', // Wajib ada
        scope: '/',     // Wajib ada
        icons: [
          {
            src: 'images/logo2.png', // Pastikan file ini ada di folder public
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/logo2.png', // Pastikan file ini ada di folder public
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})