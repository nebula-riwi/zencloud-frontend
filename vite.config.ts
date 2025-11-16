import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    // Continuar el build incluso si hay errores de tipo
    // Los errores críticos seguirán fallando, pero warnings no
    rollupOptions: {
      output: {
        // Code splitting: separar vendor chunks y chunks por rutas
        manualChunks: {
          // Separar Vue y sus dependencias core
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Separar librerías de UI
          'ui-vendor': ['lucide-vue-next', '@vueuse/core'],
          // Separar utilidades
          'utils-vendor': ['axios', 'clsx', 'tailwind-merge', 'zod'],
          // Separar @n8n/chat si se usa en múltiples lugares
          'chat-vendor': ['@n8n/chat'],
        },
        // Optimizar nombres de chunks para mejor caché
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `images/[name]-[hash][extname]`
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
      onwarn(warning, warn) {
        // Ignorar warnings específicos que no impiden el build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
        warn(warning)
      },
    },
    // Optimización de chunk size
    chunkSizeWarningLimit: 1000,
    // Mejorar el rendimiento del build
    cssCodeSplit: true,
  },
  // Optimizaciones adicionales
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'lucide-vue-next'],
    exclude: ['@n8n/chat'], // Excluir si causa problemas de carga
  },
})

