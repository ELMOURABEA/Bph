import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'صيدليات البنداري',
          short_name: 'البنداري',
          description: 'صيدليات البنداري - رعاية صحية متكاملة منذ 1980',
          theme_color: '#ce1126',
          icons: [
            {
              src: 'https://play-lh.googleusercontent.com/yL9BI7YVzh_lQN4ghSJv387TvBpbGvACLzqe3FLB8l91on2fwDrOeQVFU-QzZJv-5DVdZ9ixbZTvjEKBSO82rRw=s192',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://play-lh.googleusercontent.com/yL9BI7YVzh_lQN4ghSJv387TvBpbGvACLzqe3FLB8l91on2fwDrOeQVFU-QzZJv-5DVdZ9ixbZTvjEKBSO82rRw=s512',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
