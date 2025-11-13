import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/databases',
    name: 'Databases',
    component: () => import('@/views/databases/DatabasesListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('@/views/billing/BillingView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: () => import('@/views/webhooks/WebhooksView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sql-editor',
    name: 'SqlEditor',
    component: () => import('@/views/sql/SqlEditorView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/promo',
    name: 'Promo',
    component: () => import('@/views/PromoView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      // Calcular offset dinámicamente basado en el header
      const headerElement = document.querySelector('header')
      const headerHeight = headerElement?.offsetHeight || 100
      const offset = headerHeight + 20 // 20px adicionales de margen
      
      return {
        el: to.hash,
        behavior: 'smooth',
        top: offset,
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// Guard de autenticación
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.initializeAuth()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Guardar la ruta de destino y redirigir al home (donde está el modal de login)
    next({ 
      name: 'Home', 
      query: { redirect: to.fullPath, action: 'login' }
    })
  } else {
    next()
  }
})

export default router

