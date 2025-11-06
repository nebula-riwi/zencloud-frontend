import { ref, onMounted } from 'vue'

interface ImageFallbackOptions {
  src: string
  fallback?: string
  onError?: () => void
  onLoad?: () => void
}

export function useImageFallback(options: ImageFallbackOptions) {
  const { src, fallback, onError, onLoad } = options
  const currentSrc = ref(src)
  const isLoading = ref(true)
  const hasError = ref(false)

  const handleError = () => {
    hasError.value = true
    isLoading.value = false
    
    if (fallback) {
      currentSrc.value = fallback
    }
    
    onError?.()
  }

  const handleLoad = () => {
    isLoading.value = false
    hasError.value = false
    onLoad?.()
  }

  onMounted(() => {
    // Precargar imagen para detectar errores
    const img = new Image()
    img.onload = handleLoad
    img.onerror = handleError
    img.src = src
  })

  return {
    currentSrc,
    isLoading,
    hasError,
    handleError,
    handleLoad,
  }
}

// Fallback SVG placeholder
export const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23ffffff'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='16' fill='%23666666'%3EImagen no disponible%3C/text%3E%3C/svg%3E`

// Logos locales de respaldo para motores de BD (SVG inline)
export const ENGINE_FALLBACKS: Record<string, string> = {
  mysql: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%230075A8'%3EMySQL%3C/text%3E%3C/svg%3E`,
  postgresql: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23336791'%3EPostgreSQL%3C/text%3E%3C/svg%3E`,
  mongodb: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='%2347A248'%3EMongoDB%3C/text%3E%3C/svg%3E`,
  sqlserver: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='%23CC0000'%3ESQL Server%3C/text%3E%3C/svg%3E`,
  redis: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='32' fill='%23DC322F'%3ERedis%3C/text%3E%3C/svg%3E`,
  cassandra: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='22' fill='%231C65DD'%3ECassandra%3C/text%3E%3C/svg%3E`,
}

