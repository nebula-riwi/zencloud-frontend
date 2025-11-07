import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface MetaConfig {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  xCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  keywords?: string
}

const DEFAULT_META: Required<MetaConfig> = {
  title: 'ZenCloud - Gestión automatizada de bases de datos en la nube',
  description: 'Crea, escala y administra instancias de bases de datos de forma centralizada, intuitiva y segura. Empieza gratis con 2 bases de datos por motor.',
  ogTitle: 'ZenCloud - Plataforma Cloud Database',
  ogDescription: 'Gestión automatizada de bases de datos en la nube con soporte para MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra.',
  ogImage: '/og-image.png',
  ogUrl: 'https://zencloud.app',
  xCard: 'summary_large_image',
  keywords: 'base de datos, cloud, mysql, postgresql, mongodb, redis, cassandra, database, automatización',
}

export function useMeta(config: MetaConfig = {}) {
  const route = useRoute()

  const updateMeta = (metaConfig: MetaConfig) => {
    const meta = { ...DEFAULT_META, ...metaConfig }

    // Update title
    document.title = meta.title

    // Update or create meta tags
    updateMetaTag('description', meta.description)
    updateMetaTag('keywords', meta.keywords)

    // Open Graph tags
    updateMetaTag('og:title', meta.ogTitle, 'property')
    updateMetaTag('og:description', meta.ogDescription, 'property')
    updateMetaTag('og:image', meta.ogImage, 'property')
    updateMetaTag('og:url', meta.ogUrl, 'property')
    updateMetaTag('og:type', 'website', 'property')
    updateMetaTag('og:site_name', 'ZenCloud', 'property')

    // X Card tags
    updateMetaTag('twitter:card', meta.xCard)
    updateMetaTag('twitter:title', meta.ogTitle)
    updateMetaTag('twitter:description', meta.ogDescription)
    updateMetaTag('twitter:image', meta.ogImage)

    // Additional meta tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    updateMetaTag('theme-color', '#e78a53')
  }

  const updateMetaTag = (name: string, content: string, attributeType: 'name' | 'property' = 'name') => {
    const selector = `meta[${attributeType}="${name}"]`
    let element = document.querySelector(selector)

    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attributeType, name)
      document.head.appendChild(element)
    }

    element.setAttribute('content', content)
  }

  // Update meta on mount and when route changes
  onMounted(() => {
    updateMeta(config)
  })

  watch(() => route.path, () => {
    updateMeta(config)
  })

  return {
    updateMeta,
  }
}

// Preset meta configurations for common pages
export const META_PRESETS: Record<string, MetaConfig> = {
  home: {
    title: 'ZenCloud - Gestión automatizada de bases de datos en la nube',
    description: 'Crea, escala y administra instancias de bases de datos de forma centralizada. Soporte para MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra.',
    ogTitle: 'ZenCloud - Plataforma Cloud Database',
  },
  login: {
    title: 'Iniciar Sesión - ZenCloud',
    description: 'Accede a tu cuenta de ZenCloud para gestionar tus bases de datos.',
    ogTitle: 'Iniciar Sesión - ZenCloud',
  },
  register: {
    title: 'Crear Cuenta - ZenCloud',
    description: 'Crea tu cuenta en ZenCloud y empieza a gestionar tus bases de datos gratis.',
    ogTitle: 'Crear Cuenta - ZenCloud',
  },
  dashboard: {
    title: 'Dashboard - ZenCloud',
    description: 'Panel de control de ZenCloud para gestionar tus bases de datos.',
    ogTitle: 'Dashboard - ZenCloud',
  },
  databases: {
    title: 'Bases de Datos - ZenCloud',
    description: 'Gestiona todas tus bases de datos desde un solo lugar.',
    ogTitle: 'Bases de Datos - ZenCloud',
  },
}

