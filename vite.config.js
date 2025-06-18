import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'],
  },

  server: {
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true,
      timeout: 1000,
    },
  },
})
