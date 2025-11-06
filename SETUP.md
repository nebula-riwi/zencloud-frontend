# 🚀 Setup - ZenCloud Frontend

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Configuration (REQUERIDO)
VITE_API_URL=https://service.voyager.andrescortes.dev/api

# Environment
VITE_ENV=development

# App Configuration
VITE_APP_NAME=ZenCloud
VITE_APP_DESCRIPTION=Plataforma Cloud Database

# Optional: Analytics & Monitoring
# VITE_SENTRY_DSN=tu-sentry-dsn
# VITE_GA_TRACKING_ID=tu-google-analytics-id

# Optional: Feature Flags
# VITE_ENABLE_AI_ASSISTANT=false
```

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── home/           # Componentes específicos de home
│   ├── layout/         # Componentes de layout
│   ├── sections/       # Secciones de la landing
│   └── ui/             # Componentes UI base
├── composables/        # Composables de Vue
├── lib/                # Utilidades y helpers
├── pages/              # Páginas de la aplicación
├── router/             # Configuración de rutas
├── services/           # Servicios API
├── stores/             # Stores de Pinia
└── types/              # Tipos TypeScript

## 🔐 Seguridad

- **Tokens**: Los access tokens se guardan en `sessionStorage` (se borran al cerrar pestaña)
- **Refresh Tokens**: Se guardan en `localStorage` para persistencia
- **Timeout**: Las peticiones tienen un timeout de 30 segundos
- **Retry**: Las peticiones fallidas se reintentan hasta 3 veces
- **CORS**: Configurado para la API especificada

## 🎨 Características Implementadas

- ✅ Autenticación con JWT + Refresh Token
- ✅ Sistema de notificaciones (Toast)
- ✅ Validación de formularios con Zod
- ✅ Guards de autenticación en rutas
- ✅ Meta tags dinámicos para SEO
- ✅ Componentes UI base (Button, Input, Toast)
- ✅ Manejo robusto de errores de red
- ✅ Fallback para imágenes CDN
- ✅ Scroll behavior dinámico
- ✅ Diseño responsive
- ✅ Tema oscuro

## 🧪 Testing

(Por implementar)

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e
```

## 📱 Páginas

- `/` - Landing page
- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro de usuario
- `/dashboard` - Panel de control (protegido)
- `/databases` - Gestión de bases de datos (protegido)
- `/plans` - Planes y precios (protegido)
- `/billing` - Facturación (protegido)
- `/webhooks` - Webhooks (protegido)

## 🔧 Configuración Adicional

### TypeScript

El proyecto usa TypeScript en modo estricto. Los tipos globales están en `src/types/index.ts`.

### Tailwind CSS

Configuración personalizada con:
- Color primario: `#e78a53`
- Tema oscuro por defecto
- Animaciones personalizadas
- Paleta de colores en OKLCH

### Vite

- Alias `@/` apunta a `src/`
- Puerto de desarrollo: 3000
- HMR habilitado

## 🐛 Troubleshooting

### Error: Cannot find module '@/...'

Asegúrate de que el alias esté configurado en `tsconfig.json` y `vite.config.ts`.

### Error de CORS

Verifica que `VITE_API_URL` esté correctamente configurado y que el backend permita peticiones desde tu origen.

### Imágenes no cargan

Las imágenes de motores de BD tienen fallback automático. Si no cargan, se mostrará un placeholder SVG.

## 📚 Recursos

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zod Documentation](https://zod.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)

