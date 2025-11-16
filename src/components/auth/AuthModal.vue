<template>
  <Dialog :model-value="modelValue" @update:model-value="updateValue">
    <div class="relative w-full max-w-[440px] mx-auto">
      <!-- Main Modal Container -->
      <div class="bg-gradient-to-br from-black/98 via-black/95 to-black/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        <!-- Close Button -->
        <button
          @click="updateValue(false)"
          class="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95 hover:rotate-90"
          aria-label="Cerrar modal"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Decorative gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#e78a53]/5 via-transparent to-transparent pointer-events-none"></div>
        
        <!-- Content -->
        <div class="relative z-10 p-8 md:p-10">
          <Transition name="form-fade" mode="out-in">
            <!-- Forgot Password View -->
            <div v-if="showForgotPassword" key="forgot" class="space-y-6">
            <!-- Logo Section -->
            <div class="flex flex-col items-center mb-8">
              <div class="mb-6">
                <span class="text-4xl font-bold tracking-tight">
                  <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
                </span>
              </div>
              <p class="text-white/60 text-sm text-center">
                Ingresa tu correo para recuperar tu contraseña
              </p>
            </div>

            <form @submit.prevent="handleForgotPassword" class="space-y-5">
              <div class="space-y-2">
                <label for="forgot-email" class="block text-sm font-semibold text-white/90 transition-colors duration-200">
                  Correo Electrónico
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="forgot-email"
                    v-model="forgotPasswordData.email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    :disabled="loading"
                    autocomplete="email"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Enviando...' : 'Enviar enlace de recuperación' }}
              </button>
            </form>

            <div class="text-center pt-4">
              <button
                type="button"
                @click="showForgotPassword = false"
                class="inline-flex items-center gap-2 text-sm text-[#e78a53] hover:text-[#f59a63] font-medium transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 group"
              >
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio de sesión
              </button>
            </div>
            </div>

            <!-- Reset Password View -->
            <div v-else-if="showResetPassword" key="reset" class="space-y-6">
            <!-- Logo Section -->
            <div class="flex flex-col items-center mb-8">
              <div class="mb-6">
                <span class="text-4xl font-bold tracking-tight">
                  <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
                </span>
              </div>
              <p class="text-white/60 text-sm text-center">
                Ingresa tu nueva contraseña
              </p>
            </div>

            <form @submit.prevent="handleResetPassword" class="space-y-5">
              <div class="space-y-2">
                <label :for="'reset-password-' + (showPassword ? 'text' : 'password')" class="block text-sm font-semibold text-white/90">
                  Nueva Contraseña
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    :id="'reset-password-' + (showPassword ? 'text' : 'password')"
                    v-model="resetPasswordData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                    autocomplete="new-password"
                    class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-all duration-300 hover:scale-110 active:scale-95"
                    tabindex="-1"
                  >
                    <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-white/50 mt-1.5 ml-1">
                  Mínimo 8 caracteres, mayúsculas, minúsculas y números
                </p>
              </div>

              <div class="space-y-2">
                <label :for="'reset-confirm-' + (showConfirmPassword ? 'text' : 'password')" class="block text-sm font-semibold text-white/90">
                  Confirmar Contraseña
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    :id="'reset-confirm-' + (showConfirmPassword ? 'text' : 'password')"
                    v-model="resetPasswordData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                    autocomplete="new-password"
                    class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
                    tabindex="-1"
                  >
                    <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Cambiando contraseña...' : 'Cambiar contraseña' }}
              </button>
            </form>
            </div>

            <!-- Login/Register View -->
            <div v-else key="auth" class="space-y-6">
            <!-- Logo Section -->
            <div class="flex flex-col items-center mb-8">
              <!-- ZenCloud Logo -->
              <div class="mb-6">
                <span class="text-4xl font-bold tracking-tight">
                  <span class="text-[#e78a53]" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">Zen</span><span class="text-white" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">Cloud</span>
                </span>
              </div>
              
              <!-- Subtitle -->
              <p class="text-white/60 text-sm text-center">
                {{ isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta completamente gratis' }}
              </p>
            </div>

            <!-- Login Form -->
            <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-5">
              <div class="space-y-2">
                <label for="login-email" class="block text-sm font-semibold text-white/90">
                  Correo Electrónico
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="login-email"
                    v-model="loginData.email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    :disabled="loading"
                    autocomplete="email"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label :for="'login-password-' + (showLoginPassword ? 'text' : 'password')" class="block text-sm font-semibold text-white/90">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    @click="showForgotPassword = true"
                    class="text-xs text-[#e78a53] hover:text-[#f59a63] transition-all duration-300 focus:outline-none hover:scale-105 active:scale-95 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    :id="'login-password-' + (showLoginPassword ? 'text' : 'password')"
                    v-model="loginData.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                    autocomplete="current-password"
                    class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                  <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95"
                    tabindex="-1"
                  >
                    <svg v-if="showLoginPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
              </button>
            </form>

            <!-- Register Form -->
            <form v-else @submit.prevent="handleRegister" class="space-y-5">
              <div class="space-y-2">
                <label for="register-name" class="block text-sm font-semibold text-white/90">
                  Nombre Completo
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="register-name"
                    v-model="registerData.fullName"
                    type="text"
                    placeholder="Tu nombre completo"
                    required
                    :disabled="loading"
                    autocomplete="name"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label for="register-email" class="block text-sm font-semibold text-white/90">
                  Correo Electrónico
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="register-email"
                    v-model="registerData.email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    :disabled="loading"
                    autocomplete="email"
                    class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <label :for="'register-password-' + (showRegisterPassword ? 'text' : 'password')" class="block text-sm font-semibold text-white/90">
                  Contraseña
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    :id="'register-password-' + (showRegisterPassword ? 'text' : 'password')"
                    v-model="registerData.password"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                    autocomplete="new-password"
                    class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                  <button
                    type="button"
                    @click="showRegisterPassword = !showRegisterPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-all duration-300 focus:outline-none hover:scale-110 active:scale-95"
                    tabindex="-1"
                  >
                    <svg v-if="showRegisterPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                <p class="text-xs text-white/50 mt-1.5 ml-1">
                  Mínimo 8 caracteres, mayúsculas, minúsculas, números y un carácter especial
                </p>
              </div>
              
              <div class="space-y-2">
                <label :for="'register-confirm-password-' + (showConfirmPassword ? 'text' : 'password')" class="block text-sm font-semibold text-white/90">
                  Confirmar Contraseña
                </label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                    <svg class="h-5 w-5 text-white/40 transition-colors duration-300 group-focus-within:text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    :id="'register-confirm-password-' + (showConfirmPassword ? 'text' : 'password')"
                    v-model="registerData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="loading"
                    autocomplete="new-password"
                    class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#e78a53]/50 focus:border-[#e78a53]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-white/20 hover:bg-black/50 focus:scale-[1.02] focus:shadow-lg focus:shadow-[#e78a53]/20"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-all duration-300 hover:scale-110 active:scale-95"
                    tabindex="-1"
                  >
                    <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                    <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#e78a53] via-[#e78a53] to-[#f59a63] hover:from-[#f59a63] hover:via-[#f59a63] hover:to-[#e78a53] text-white font-semibold text-base shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50 transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center active:scale-95 hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <span v-if="loading" class="mr-2">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
              </button>
            </form>

            <!-- Social Login Section -->
            <div class="mt-6">
              <!-- Separator -->
              <div class="relative flex items-center my-6">
                <div class="flex-1 border-t border-white/10"></div>
                <span class="px-4 text-sm text-white/50 font-medium">O CONTINÚA CON</span>
                <div class="flex-1 border-t border-white/10"></div>
              </div>

              <!-- Social Buttons -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="handleSocialLogin('github')"
                  :disabled="loading"
                  class="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                  </svg>
                  GitHub
                </button>
                <button
                  type="button"
                  @click="handleSocialLogin('google')"
                  :disabled="loading"
                  class="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                >
                  <svg class="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <!-- Toggle between Login and Register -->
            <div class="mt-6 pt-6 border-t border-white/10">
              <p class="text-center text-sm text-white/60">
                {{ isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? " }}
                <button
                  type="button"
                  @click="toggleMode"
                  class="text-[#e78a53] font-semibold hover:text-[#f59a63] transition-all duration-300 underline-offset-4 hover:underline focus:outline-none hover:scale-105 active:scale-95"
                >
                  {{ isLogin ? 'Regístrate gratis' : 'Inicia sesión' }}
                </button>
              </p>
            </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { authService } from '@/services/auth.service'
import { loginSchema, registerSchema, useFormValidation } from '@/lib/validations'
import Dialog from '@/components/ui/Dialog.vue'
import type { LoginFormData, RegisterFormData } from '@/lib/validations'

interface Props {
  modelValue: boolean
  mode?: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'login'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:mode': [value: 'login' | 'register']
}>()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isLogin = ref(props.mode === 'login')
const loading = ref(false)
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showForgotPassword = ref(false)
const showResetPassword = ref(false)

const loginData = ref<LoginFormData>({
  email: '',
  password: '',
})

const registerData = ref<RegisterFormData>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const forgotPasswordData = ref({
  email: '',
})

const resetPasswordData = ref({
  password: '',
  confirmPassword: '',
})
const resetContext = ref({ email: '', token: '' })

const { validate: validateLogin } = useFormValidation(loginSchema)
const { validate: validateRegister } = useFormValidation(registerSchema)

watch(() => props.mode, (newMode) => {
  isLogin.value = newMode === 'login'
  showForgotPassword.value = false
  showResetPassword.value = false
})

// Check if reset password token is in URL
watch(
  () => ({ token: route.query.token, email: route.query.email }),
  ({ token, email }) => {
    if (typeof token === 'string' && typeof email === 'string' && token && email) {
      showResetPassword.value = true
      showForgotPassword.value = false
      resetContext.value = { email, token }
    }
  },
  { immediate: true }
)

function updateValue(value: boolean) {
  emit('update:modelValue', value)
  if (!value) {
    showForgotPassword.value = false
    showResetPassword.value = false
    resetContext.value = { email: '', token: '' }
  }
}

function toggleMode() {
  isLogin.value = !isLogin.value
  emit('update:mode', isLogin.value ? 'login' : 'register')
  showForgotPassword.value = false
  showResetPassword.value = false
}

function handleSocialLogin(provider: 'github' | 'google') {
  toastStore.info('Próximamente', `Login con ${provider} estará disponible pronto`)
  // TODO: Implementar login social
  // window.location.href = `/api/auth/${provider}`
}

async function handleForgotPassword() {
  if (!forgotPasswordData.value.email) {
    toastStore.warning('Email requerido', 'Por favor ingresa tu correo electrónico')
    return
  }

  loading.value = true
  try {
    await authService.forgotPassword(forgotPasswordData.value.email.trim())
    toastStore.success('Solicitud recibida', 'Si el correo existe, enviamos un enlace para restablecer tu contraseña.')
    showForgotPassword.value = false
    forgotPasswordData.value.email = ''
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'No se pudo enviar el correo. Intenta nuevamente.'
    toastStore.error('Error', message)
  } finally {
    loading.value = false
  }
}

async function handleResetPassword() {
  if (resetPasswordData.value.password !== resetPasswordData.value.confirmPassword) {
    toastStore.warning('Contraseñas no coinciden', 'Las contraseñas deben ser iguales')
    return
  }

  if (resetPasswordData.value.password.length < 8) {
    toastStore.warning('Contraseña muy corta', 'La contraseña debe tener al menos 8 caracteres.')
    return
  }

  if (!resetContext.value.email || !resetContext.value.token) {
    toastStore.error('Enlace inválido', 'El enlace para restablecer tu contraseña no es válido.')
    return
  }

  loading.value = true
  try {
    await authService.resetPassword({
      email: resetContext.value.email,
      token: resetContext.value.token,
      newPassword: resetPasswordData.value.password,
      confirmPassword: resetPasswordData.value.confirmPassword,
    })
    toastStore.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada correctamente')
    showResetPassword.value = false
    resetPasswordData.value.password = ''
    resetPasswordData.value.confirmPassword = ''
    resetContext.value = { email: '', token: '' }
    updateValue(false)
    // Redirigir a Home y abrir modal de login
    router.push({ name: 'Home', query: { action: 'login' } })
  } catch (error: any) {
    const message = error?.response?.data?.message || error.message || 'No se pudo cambiar la contraseña. Intenta nuevamente.'
    toastStore.error('Error', message)
  } finally {
    loading.value = false
  }
}

async function handleLogin() {
  const validation = validateLogin(loginData.value)
  
  if (!validation.success) {
    toastStore.warning('Formulario inválido', 'Por favor, corrige los errores antes de continuar.')
    return
  }

  loading.value = true
  
  try {
    const response = await authStore.login(validation.data!)
    
    toastStore.success('¡Bienvenido!', `Hola ${response.user.name}`)
    
    updateValue(false)
    
    // Redirigir a la ruta guardada o al dashboard
    const redirectParam = typeof route.query.redirect === 'string' ? route.query.redirect : null
    const redirectPath = redirectParam && redirectParam.startsWith('/') ? redirectParam : '/dashboard'
    await router.replace(redirectPath)
  } catch (error: any) {
    console.error('Login error:', error)
    
    const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
    toastStore.error('Error de autenticación', errorMessage)
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  const validation = validateRegister(registerData.value)
  
  if (!validation.success) {
    // Mostrar errores de validación
    const errors = validation.errors
    if (errors) {
      const firstError = Object.values(errors)[0]
      if (Array.isArray(firstError) && firstError.length > 0) {
        toastStore.warning('Formulario inválido', firstError[0])
      } else {
        toastStore.warning('Formulario inválido', 'Por favor, corrige los errores antes de continuar.')
      }
    }
    return
  }

  loading.value = true
  
  try {
    // El backend retorna solo un mensaje, no un token
    await authService.register({
      email: validation.data!.email,
      password: validation.data!.password,
      confirmPassword: validation.data!.confirmPassword,
      fullName: validation.data!.fullName,
    })
    
    toastStore.success('¡Cuenta creada!', 'Por favor verifica tu email antes de iniciar sesión.')
    
    updateValue(false)
    
    // Cambiar a modo login para que el usuario pueda iniciar sesión después de verificar
    emit('update:mode', 'login')
    isLogin.value = true
  } catch (error: any) {
    console.error('Register error:', error)
    
    let errorMessage = 'Error al crear cuenta. Por favor, intenta nuevamente.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      // Si el error es el mensaje de éxito del store, mostrarlo como éxito
      if (error.message.includes('Registro exitoso')) {
        toastStore.success('¡Cuenta creada!', 'Por favor verifica tu email antes de iniciar sesión.')
        updateValue(false)
        emit('update:mode', 'login')
        isLogin.value = true
        return
      }
      errorMessage = error.message
    } else if (error.response?.status === 409) {
      errorMessage = 'El email ya está registrado.'
    }
    
    toastStore.error('Error de registro', errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Form transition animations */
.form-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.form-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.form-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.form-fade-enter-to,
.form-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Logo animation */
@keyframes logoGlow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.1);
  }
}

/* Input focus animation */
input:not(:disabled):focus {
  animation: inputPulse 0.3s ease-out;
}

@keyframes inputPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(231, 138, 83, 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(231, 138, 83, 0.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(231, 138, 83, 0);
  }
}

/* Icon animations */
svg {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
