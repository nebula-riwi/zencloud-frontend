# 🎨 ZenCloud Frontend

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)

**Interfaz Moderna para Gestión Multi-Motor de Bases de Datos**

[Características](#-características) • [Instalación](#-instalación) • [Componentes](#-componentes) • [Diagramas](#-diagramas)

</div>

---

## 📖 Descripción

Frontend moderno construido con **Vue.js 3** y **TypeScript** que proporciona una interfaz intuitiva para gestionar bases de datos SQL y NoSQL. Utiliza Composition API, Pinia para estado global, y TailwindCSS para diseño responsive.

## ✨ Características

### 🎯 Gestión de Bases de Datos
- **Dashboard interactivo** con métricas en tiempo real
- **Creación dinámica** de bases de datos (6 motores)
- **Visualización de credenciales** segura
- **Exportación SQL** con descarga directa
- **Activación/desactivación** de instancias
- **Eliminación** con confirmación

### 🔍 SQL Editor Avanzado
- **Editor de código** con syntax highlighting (Ace Editor)
- **Ejecución de queries** en tiempo real
- **Historial de consultas** por base de datos
- **Visualización de resultados** en tabla
- **Listado de tablas** y esquemas
- **Soporte multi-motor** (MySQL, PostgreSQL, SQL Server)

### 🎨 UI/UX Moderna
- **Diseño responsive** (mobile-first)
- **Tema oscuro** optimizado
- **Animaciones fluidas** con Framer Motion
- **Componentes reutilizables** (shadcn/ui)
- **Toasts informativos** con Sonner
- **Modales y diálogos** accesibles

### 🔐 Autenticación
- **Login/Register** con validación
- **Gestión de perfil** de usuario
- **Cambio de contraseña**
- **Tokens JWT** automáticos
- **Refresh tokens** seamless

### 📊 Visualización de Datos
- **Gráficos interactivos** con Chart.js
- **Estadísticas** de uso
- **Métricas** de rendimiento
- **Dashboard de actividad** con filtros temporales

### 🔔 Webhooks & Notificaciones
- **Gestión de webhooks** para eventos en tiempo real
- **Contador de eventos** ejecutados
- **Configuración personalizada** por tipo de evento
- **Activación/desactivación** dinámica

### 💳 Facturación
- **Integración con MercadoPago** para pagos
- **Gestión de planes** y suscripciones
- **Historial de pagos** detallado
- **Estadísticas de uso** de recursos

### 📋 Sistema de Actividad
- **Logs de bases de datos** en tiempo real
- **Filtros temporales**: Hoy, Esta Semana, Este Mes
- **Visualización detallada** de acciones (crear, editar, eliminar)
- **Información de IP** y timestamp

### 🤖 AI Assistant
- **Chat inteligente** con contexto del usuario
- **Sugerencias** de queries SQL
- **Ayuda contextual** sobre bases de datos

### 💬 Soporte Técnico
- **Formulario de contacto** integrado
- **Integración con WhatsApp** para soporte directo
- **Mensaje pre-formateado** profesional

## 🛠 Tecnologías

### Core
```
Vue.js 3.5  │  TypeScript 5.7  │  Vite 6.0  │  Pinia 2.2
```

### UI Framework
```
TailwindCSS 3.4  │  shadcn/ui  │  Radix Vue  │  Lucide Icons
```

### Librerías
- **Axios** v1.7.9 - HTTP client
- **Vue Router** v4.5.0 - Routing
- **Pinia** v2.2.8 - State management
- **Ace Editor** v1.38.1 - Code editor
- **Chart.js** v4.4.7 - Charts
- **Sonner** v1.7.4 - Toasts
- **Zod** v3.24.1 - Validation

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/nebula-riwi/zencloud-frontend.git
cd zencloud-frontend

# Instalar dependencias
npm install

# Configurar variables
cp .env.example .env

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview producción
npm run preview
```

### Variables de Entorno

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=ZenCloud
```

## 📁 Estructura del Proyecto

```
zencloud-frontend/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes UI reutilizables
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...
│   ├── views/           # Páginas/Vistas
│   │   ├── auth/        # Login, Register
│   │   ├── databases/   # Lista de BDs
│   │   ├── sql/         # SQL Editor
│   │   ├── billing/     # Facturación y pagos
│   │   ├── webhooks/    # Gestión de webhooks
│   │   ├── logs/        # Activity logs
│   │   ├── support/     # Soporte técnico
│   │   ├── settings/    # Configuración
│   │   └── dashboard/   # Dashboard
│   ├── stores/          # Pinia stores
│   │   ├── auth.ts      # Estado autenticación
│   │   ├── database.ts  # Estado bases de datos
│   │   └── toast.ts     # Notificaciones
│   ├── services/        # API services
│   │   ├── api.ts       # Axios config
│   │   ├── auth.ts      # Auth endpoints
│   │   └── database.ts  # DB endpoints
│   ├── router/          # Vue Router
│   ├── types/           # TypeScript types
│   └── utils/           # Utilidades
├── public/              # Assets públicos
└── docs/                # Documentación y diagramas
```

## 🧩 Componentes Principales

### DatabaseCard
Tarjeta que muestra información de una base de datos.

```vue
<DatabaseCard 
  :database="db"
  @export="handleExport"
  @delete="handleDelete"
/>
```

### SqlEditor
Editor de código SQL con syntax highlighting.

```vue
<SqlEditor 
  :instanceId="instanceId"
  :engine="engine"
  @query-executed="handleResult"
/>
```

### DataTable
Tabla para mostrar resultados de queries.

```vue
<DataTable 
  :columns="columns"
  :data="rows"
  :pagination="true"
/>
```

## 🔌 API Integration

### Configuración Axios

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000
})

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = useAuthStore().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Ejemplo de Servicio

```typescript
export const databaseService = {
  async getAll() {
    const { data } = await api.get('/DatabaseInstance')
    return data
  },
  
  async create(payload: CreateDatabaseDto) {
    const { data } = await api.post('/DatabaseInstance', payload)
    return data
  },
  
  async export(instanceId: string) {
    const { data } = await api.get(
      `/DatabaseInstance/${instanceId}/export`,
      { responseType: 'blob' }
    )
    return data
  }
}
```

## 📊 Arquitectura y Diagramas

### Arquitectura del Sistema Completo

![Arquitectura ZenCloud](../zencloud-backend/docs/diagrams/architecture.drawio.png)

**Frontend en el ecosistema:**
- **Cliente Web**: Vue.js 3 + TypeScript + Composition API
- **Estado Global**: Pinia stores (auth, database, toast)
- **Comunicación**: Axios con interceptors JWT
- **UI**: TailwindCSS + shadcn/ui + Radix Vue
- **Routing**: Vue Router con guards de autenticación

---

### Flujo de Creación de Base de Datos (UI)

![Flujo de Creación](../zencloud-backend/docs/diagrams/create-database-flow.drawio.png)

**Interacción del usuario:**
1. Usuario hace clic en "Nueva Base de Datos"
2. Modal con formulario (motor + nombre)
3. Validación en cliente (Zod)
4. Request POST a `/api/DatabaseInstance`
5. Loading state en UI
6. Respuesta del servidor
7. Actualización del estado (Pinia)
8. Toast de confirmación
9. Redirección a lista actualizada

---

### Casos de Uso desde la UI

![Casos de Uso](../zencloud-backend/docs/diagrams/use-cases.drawio.png)

**Vistas principales:**
- **Login/Register** (`/auth/login`, `/auth/register`)
- **Dashboard** (`/`) - Métricas y accesos rápidos
- **Lista de BDs** (`/databases`) - Tarjetas con todas las instancias
- **SQL Editor** (`/sql-editor`) - Editor interactivo para queries
- **Webhooks** (`/webhooks`) - Gestión de eventos y notificaciones
- **Facturación** (`/billing`) - Planes, pagos y suscripciones
- **Actividad** (`/activity-logs`) - Logs de acciones en bases de datos
- **Soporte** (`/support`) - Contacto directo por WhatsApp
- **Configuración** (`/settings`) - Perfil y ajustes de cuenta

**Componentes clave:**
- `DatabaseCard.vue` - Tarjeta de BD con acciones
- `SqlEditor.vue` - Editor Ace con syntax highlighting
- `DataTable.vue` - Tabla de resultados
- `CreateDatabaseDialog.vue` - Modal de creación

---

### Estructura de Componentes Vue

```
┌─────────────────────────────────────────┐
│          App.vue (Root)                 │
│  ┌───────────────────────────────────┐  │
│  │    Router View                    │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  AuthLayout / MainLayout    │  │  │
│  │  │  ┌───────────────────────┐  │  │  │
│  │  │  │  Page Components      │  │  │  │
│  │  │  │  - DatabasesListView  │  │  │  │
│  │  │  │  - SqlEditorView      │  │  │  │
│  │  │  │  - DashboardView      │  │  │  │
│  │  │  └───────────────────────┘  │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

State Management (Pinia):
├── authStore - JWT, user, login/logout
├── databaseStore - Instancias, CRUD
├── webhookStore - Webhooks y eventos
├── paymentStore - Pagos y suscripciones
├── auditLogStore - Logs de actividad
├── aiStore - AI Assistant
└── toastStore - Notificaciones
```

---

📁 **Diagramas completos del sistema**: Ver [`../zencloud-backend/docs/diagrams`](../zencloud-backend/docs/diagrams) para todos los diagramas arquitectónicos

## 🎨 Tema y Estilos

### TailwindCSS Configuration

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#e78a53',
        background: '#0a0a0a',
        card: '#1a1a1a',
        border: 'rgba(255,255,255,0.1)'
      }
    }
  }
}
```

### Componentes shadcn/ui Instalados

- Button
- Card
- Dialog
- Input
- Select
- Table
- Badge
- Avatar
- Dropdown
- Tabs
- Toast

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test:unit

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Build y Despliegue

### Build para Producción

```bash
npm run build

# Archivos en dist/
# - index.html
# - assets/
# - ...
```

### Despliegue en Nginx

```nginx
server {
    listen 80;
    server_name cloud.example.com;
    root /var/www/zencloud-frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Variables de Producción

```bash
VITE_API_BASE_URL=https://api.example.com/api
VITE_APP_NAME=ZenCloud
```

## 🔧 Scripts NPM

```json
{
  "dev": "vite",
  "build": "vue-tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .vue,.js,.ts",
  "format": "prettier --write \"src/**/*.{vue,ts,js}\"",
  "type-check": "vue-tsc --noEmit"
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Commits Convencionales

```
feat: nueva característica
fix: corrección de bug
docs: documentación
style: formato, sin cambios de código
refactor: refactorización
test: agregar tests
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👥 Equipo

Desarrollado por **[Nebula-RIWI](https://github.com/nebula-riwi)**

---

<div align="center">
  <strong>⭐ Si te gusta el proyecto, dale una estrella!</strong>
</div>
