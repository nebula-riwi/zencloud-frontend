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
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/pages/auth/LoginPage.vue'),
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/pages/auth/RegisterPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/databases',
    name: 'Databases',
    component: () => import('@/pages/DatabasesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/plans',
    name: 'Plans',
    component: () => import('@/pages/PlansPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('@/pages/BillingPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/webhooks',
    name: 'Webhooks',
    component: () => import('@/pages/WebhooksPage.vue'),
    meta: { requiresAuth: true },
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
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Guardar la ruta de destino para redirección después del login
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Si ya está autenticado y va a login, redirigir a dashboard
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router

