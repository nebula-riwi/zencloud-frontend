<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import '@n8n/chat/style.css'
import { createChat } from '@n8n/chat'

const authStore = useAuthStore()
const { token, user, isAuthenticated } = storeToRefs(authStore)

let chatInstance: any = null

function initializeChat() {
  if (!isAuthenticated.value || !token.value || !user.value) {
    return
  }

  if (chatInstance) {
    return // Ya está inicializado
  }

  try {
    chatInstance = createChat({
      webhookUrl: 'https://n8n.nebula.andrescortes.dev/webhook/2d3a2185-7e66-4e25-904b-fa642d24bdf2/chat',
      metadata: {
        token: token.value,
        email: user.value.email,
        source: 'web_platform'
      }
    })
    console.log('ChatWidget: Chat inicializado correctamente')
  } catch (error) {
    console.error('ChatWidget: Error inicializando chat:', error)
  }
}

// Observar cambios en autenticación
watch([isAuthenticated, token, user], ([authenticated, newToken, newUser]) => {
  if (authenticated && newToken && newUser && !chatInstance) {
    initializeChat()
  }
}, { immediate: false })

onMounted(() => {
  if (isAuthenticated.value && token.value && user.value) {
    initializeChat()
  }
})
</script>

<style>
/* Variables CSS personalizadas para el tema ZenCloud */
:root {
  /* Colores principales - Tema ZenCloud (naranja) */
  --chat--color--primary: #e78a53;
  --chat--color--primary-shade-50: #f59a63;
  --chat--color--primary--shade-100: #d67a43;
  
  /* Color secundario - Usar un tono complementario */
  --chat--color--secondary: #e78a53;
  --chat--color-secondary-shade-50: #f59a63;
  
  /* Colores base - Tema oscuro */
  --chat--color-white: #ffffff;
  --chat--color-light: #f2f4f8;
  --chat--color-light-shade-50: #e6e9f1;
  --chat--color-light-shade-100: #c2c5cc;
  --chat--color-medium: #d2d4d9;
  --chat--color-dark: #000000;
  --chat--color-disabled: #777980;
  --chat--color-typing: #404040;
  
  /* Espaciado y bordes */
  --chat--spacing: 1rem;
  --chat--border-radius: 0.75rem;
  --chat--transition-duration: 0.3s;
  
  /* Dimensiones de la ventana */
  --chat--window--width: 400px;
  --chat--window--height: 600px;
  --chat--header-height: auto;
  
  /* Header - Tema oscuro con naranja */
  --chat--header--padding: var(--chat--spacing);
  --chat--header--background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%);
  --chat--header--color: var(--chat--color-white);
  --chat--header--border-top: none;
  --chat--header--border-bottom: 1px solid rgba(231, 138, 83, 0.3);
  
  /* Tipografía del header */
  --chat--heading--font-size: 1.5em;
  --chat--subtitle--font-size: 0.875rem;
  --chat--subtitle--line-height: 1.6;
  
  /* Textarea */
  --chat--textarea--height: 50px;
  
  /* Mensajes */
  --chat--message--font-size: 0.9375rem;
  --chat--message--padding: var(--chat--spacing);
  --chat--message--border-radius: var(--chat--border-radius);
  --chat--message-line-height: 1.6;
  
  /* Mensajes del bot - Fondo oscuro */
  --chat--message--bot--background: rgba(255, 255, 255, 0.05);
  --chat--message--bot--color: rgba(255, 255, 255, 0.9);
  --chat--message--bot--border: 1px solid rgba(231, 138, 83, 0.2);
  
  /* Mensajes del usuario - Naranja */
  --chat--message--user--background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%);
  --chat--message--user--color: var(--chat--color-white);
  --chat--message--user--border: none;
  
  /* Pre (código) */
  --chat--message--pre--background: rgba(0, 0, 0, 0.3);
  
  /* Botón toggle (flotante) - Naranja */
  --chat--toggle--background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%);
  --chat--toggle--hover--background: linear-gradient(135deg, #f59a63 0%, #e78a53 100%);
  --chat--toggle--active--background: linear-gradient(135deg, #d67a43 0%, #e78a53 100%);
  --chat--toggle--color: var(--chat--color-white);
  --chat--toggle--size: 64px;
}

/* Aplicar tema oscuro al contenedor del chat */
:root {
  --chat--window--background: linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
  --chat--window--border: 1px solid rgba(231, 138, 83, 0.3);
  --chat--window--box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(231, 138, 83, 0.2);
}

/* Estilos adicionales para el contenedor del chat */
#n8n-chat-container,
[id*="n8n-chat"] {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Texto negro en los mensajes del usuario */
#n8n-chat-container [class*="user"],
[id*="n8n-chat"] [class*="user"],
#n8n-chat-container [class*="message"][class*="user"],
[id*="n8n-chat"] [class*="message"][class*="user"],
#n8n-chat-container [class*="user-message"],
[id*="n8n-chat"] [class*="user-message"] {
  color: #000000 !important;
}

#n8n-chat-container [class*="user"] *,
[id*="n8n-chat"] [class*="user"] *,
#n8n-chat-container [class*="message"][class*="user"] *,
[id*="n8n-chat"] [class*="message"][class*="user"] * {
  color: #000000 !important;
}

/* Texto negro en los mensajes del bot/chatbot */
#n8n-chat-container [class*="bot"],
[id*="n8n-chat"] [class*="bot"],
#n8n-chat-container [class*="message"]:not([class*="user"]),
[id*="n8n-chat"] [class*="message"]:not([class*="user"]),
#n8n-chat-container [class*="bot-message"],
[id*="n8n-chat"] [class*="bot-message"] {
  color: #000000 !important;
}

#n8n-chat-container [class*="bot"] *,
[id*="n8n-chat"] [class*="bot"] *,
#n8n-chat-container [class*="message"]:not([class*="user"]) *,
[id*="n8n-chat"] [class*="message"]:not([class*="user"]) * {
  color: #000000 !important;
}

/* Texto negro en los inputs y textareas */
#n8n-chat-container input,
#n8n-chat-container textarea,
[id*="n8n-chat"] input,
[id*="n8n-chat"] textarea,
#n8n-chat-container [class*="input"],
[id*="n8n-chat"] [class*="input"],
#n8n-chat-container [class*="textarea"],
[id*="n8n-chat"] [class*="textarea"] {
  color: #000000 !important;
}

#n8n-chat-container input::placeholder,
#n8n-chat-container textarea::placeholder,
[id*="n8n-chat"] input::placeholder,
[id*="n8n-chat"] textarea::placeholder {
  color: rgba(0, 0, 0, 0.5) !important;
}

/* Asegurar que el botón tenga el tamaño correcto y sombra */
#n8n-chat-container button,
[id*="n8n-chat"] button {
  box-shadow: 0 4px 20px rgba(231, 138, 83, 0.4), 0 0 40px rgba(231, 138, 83, 0.2) !important;
  transition: all 0.3s ease !important;
}

#n8n-chat-container button:hover,
[id*="n8n-chat"] button:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 6px 30px rgba(231, 138, 83, 0.6), 0 0 60px rgba(231, 138, 83, 0.3) !important;
}
</style>
