import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
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
        start_url: '/', 
        scope: '/',     
        icons: [
          {
            src: 'images/logo2.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/logo2.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})