<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted, watch, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import '@n8n/chat/style.css'
import { createChat } from '@n8n/chat'

const authStore = useAuthStore()
const { token, user, isAuthenticated } = storeToRefs(authStore)

let chatInstance: any = null
let originalFetch: typeof fetch | null = null
let originalXHROpen: typeof XMLHttpRequest.prototype.open | null = null
let originalXHRSend: typeof XMLHttpRequest.prototype.send | null = null

function initializeChat() {
  if (!isAuthenticated.value || !token.value || !user.value) {
    console.log('ChatWidget: Usuario no autenticado, no se inicializa chat')
    return
  }

  if (chatInstance) {
    console.log('ChatWidget: Chat ya está inicializado')
    return // Ya está inicializado
  }

  try {
    console.log('ChatWidget: Inicializando chat...')
    // Interceptar peticiones HTTP antes de inicializar el chat
    setupMessageInterceptor()
    
    // Crear chat sin target ni mode - n8n creará su propio botón flotante
    chatInstance = createChat({
      webhookUrl: 'https://n8n.nebula.andrescortes.dev/webhook/2d3a2185-7e66-4e25-904b-fa642d24bdf2/chat',
      initialMessages: [
        '¡Hola! 👋',
        'Soy ZenCloud, ¿cómo puedo ayudarte hoy?'
      ],
      metadata: {
        token: token.value,
        email: user.value.email,
        source: 'web_platform'
      }
    })
    
    console.log('ChatWidget: Chat inicializado correctamente')
    
    // Aplicar traducciones después de un pequeño delay
    setTimeout(() => {
      localizeChatTexts()
      console.log('ChatWidget: Traducciones aplicadas')
    }, 1000)
  } catch (error) {
    console.error('ChatWidget: Error inicializando chat:', error)
  }
}

function setupMessageInterceptor() {
  const ensureJsonHeaders = (headers?: HeadersInit): HeadersInit => {
    if (headers instanceof Headers) {
      headers.set('Content-Type', 'application/json')
      return headers
    }
    if (Array.isArray(headers)) {
      headers.push(['Content-Type', 'application/json'])
      return headers
    }
    return { ...(headers ?? {}), 'Content-Type': 'application/json' }
  }
  // Guardar referencias originales
  if (!originalFetch) {
    originalFetch = window.fetch
  }
  if (!originalXHROpen) {
    originalXHROpen = XMLHttpRequest.prototype.open
  }
  if (!originalXHRSend) {
    originalXHRSend = XMLHttpRequest.prototype.send
  }
  
  // Interceptar fetch para agregar token en cada mensaje
  window.fetch = async function(...args) {
    const [url, options = {}] = args
    
    // Si es una petición al webhook del chat
    if (typeof url === 'string' && url.includes('n8n.nebula.andrescortes.dev/webhook') && token.value) {
      try {
        if (options.body) {
          const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
          if (body && typeof body === 'object') {
            body.metadata = {
              ...(body.metadata || {}),
              token: token.value,
              email: user.value?.email || '',
              source: 'web_platform'
            }
            options.body = JSON.stringify(body)
            options.headers = ensureJsonHeaders(options.headers)
          }
        } else {
          // Si no hay body, crear uno con metadata
          options.body = JSON.stringify({
            metadata: {
              token: token.value,
              email: user.value?.email || '',
              source: 'web_platform'
            }
          })
          options.headers = ensureJsonHeaders(options.headers)
        }
      } catch (e) {
        console.error('ChatWidget: Error interceptando fetch:', e)
      }
    }
    
    return originalFetch!.apply(this, args)
  }
  
  // Interceptar XMLHttpRequest también
  XMLHttpRequest.prototype.open = function (...args: any[]) {
    const [, url] = args
    if (url) {
      ;(this as any)._url = typeof url === 'string' ? url : url.toString()
    }
    return originalXHROpen!.apply(this, args as any)
  }
  
  XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
    const url = (this as any)._url
    if (url && url.includes('n8n.nebula.andrescortes.dev/webhook') && token.value) {
      try {
        if (body && typeof body === 'string') {
          const parsedBody = JSON.parse(body)
          if (parsedBody && typeof parsedBody === 'object') {
            parsedBody.metadata = {
              ...(parsedBody.metadata || {}),
              token: token.value,
              email: user.value?.email || '',
              source: 'web_platform'
            }
            body = JSON.stringify(parsedBody)
          }
        } else if (!body) {
          body = JSON.stringify({
            metadata: {
              token: token.value,
              email: user.value?.email || '',
              source: 'web_platform'
            }
          })
          this.setRequestHeader('Content-Type', 'application/json')
        }
      } catch (e) {
        console.error('ChatWidget: Error interceptando XMLHttpRequest:', e)
      }
    }
    return originalXHRSend!.apply(this, [body])
  }
  
  console.log('ChatWidget: Interceptor de mensajes configurado')
}

function cleanupInterceptor() {
  // Restaurar funciones originales
  if (originalFetch) {
    window.fetch = originalFetch
  }
  if (originalXHROpen) {
    XMLHttpRequest.prototype.open = originalXHROpen
  }
  if (originalXHRSend) {
    XMLHttpRequest.prototype.send = originalXHRSend
  }
}

// Observar cambios en el token para asegurar que siempre esté actualizado
watch(token, (newToken) => {
  if (newToken && chatInstance) {
    console.log('ChatWidget: Token actualizado, se incluirá en próximos mensajes')
  }
})

// Observar cambios en autenticación
watch([isAuthenticated, token, user], ([authenticated, newToken, newUser]) => {
  if (authenticated && newToken && newUser && !chatInstance) {
    initializeChat()
  } else if (!authenticated) {
    // Limpiar instancia si se desautentica
    chatInstance = null
    cleanupInterceptor()
  }
}, { immediate: false })

onMounted(() => {
  if (isAuthenticated.value && token.value && user.value) {
    initializeChat()
  }
})

onUnmounted(() => {
  cleanupInterceptor()
})

function localizeChatTexts() {
  const textReplacements: Array<{ pattern: RegExp; replacement: string }> = [
    { pattern: /hi there!? 👋?/i, replacement: '¡Hola! 👋' },
    { pattern: /start a chat\.? we're here to help you 24\/7\./i, replacement: 'Empecemos, estamos aquí para ayudarte 24/7.' },
    { pattern: /my name is (nathan|.*)\.? how can i assist you today\?/i, replacement: 'Soy ZenCloud, ¿cómo puedo ayudarte hoy?' },
    { pattern: /type your question\.\.\./i, replacement: 'Escribe tu pregunta...' },
    { pattern: /type your message\.\.\./i, replacement: 'Escribe tu mensaje...' },
    { pattern: /type your question/i, replacement: 'Escribe tu pregunta' },
    { pattern: /send message/i, replacement: 'Enviar mensaje' },
    { pattern: /send/i, replacement: 'Enviar' },
  ]

  const translateNodes = (root: Element) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
    let node: Node | null = walker.nextNode()
    while (node) {
      const original = node.textContent ?? ''
      const updated = textReplacements.reduce((text, { pattern, replacement }) => {
        return pattern.test(text) ? text.replace(pattern, replacement) : text
      }, original)

      if (original !== updated) {
        node.textContent = updated
      }
      node = walker.nextNode()
    }
  }

  const applyTranslations = (): boolean => {
    const container = document.querySelector('#n8n-chat-container, [id*="n8n-chat"]')
    if (!container) return false

    translateNodes(container as Element)

    const input =
      container.querySelector('textarea') ||
      container.querySelector('input[type="text"]')
    if (input) {
      input.setAttribute('placeholder', 'Escribe tu pregunta...')
      ;(input as HTMLTextAreaElement).placeholder = 'Escribe tu pregunta...'
      input.setAttribute('data-placeholder', 'Escribe tu pregunta...')
    }

    return true
  }

  if (applyTranslations()) {
    return
  }

  const observer = new MutationObserver(() => {
    if (applyTranslations()) {
      observer.disconnect()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
  window.setTimeout(() => observer.disconnect(), 10000)
}
</script>

<style>
/* Variables CSS personalizadas para el tema ZenCloud */
:root {
  /* Colores principales - Tema ZenCloud (naranja) */
  --chat--color--primary: #e78a53;
  --chat--color--primary-shade-50: rgba(231, 138, 83, 0.05);
  --chat--color--primary--shade-100: rgba(231, 138, 83, 0.1);
  --chat--color-secondary: #f59a63;
  --chat--color-white: #ffffff;
  --chat--color-light: #f4f4f4;
  --chat--color-light-shade-50: #fafafa;
  --chat--color-light-shade-100: #e0e0e0;
  --chat--color-medium: #a0a0a0;
  --chat--color-dark: #0f1014;
  
  /* Espaciado */
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
  --chat--message--bot--background: rgba(255, 255, 255, 0.08);
  --chat--message--bot--color: #000000;
  --chat--message--bot--border: 1px solid rgba(231, 138, 83, 0.2);
  
  /* Mensajes del usuario - MISMO FONDO, COLOR NEGRO Y BORDE NARANJA */
  --chat--message--user--background: rgba(255, 255, 255, 0.08);
  --chat--message--user--color: #000000;
  --chat--message--user--border: 1px solid rgba(231, 138, 83, 0.3);
  
  /* Pre (código) */
  --chat--message--pre--background: rgba(0, 0, 0, 0.3);
  
  /* Botón toggle (flotante) - Naranja */
  --chat--toggle--background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%);
  --chat--toggle--hover--background: linear-gradient(135deg, #f59a63 0%, #e78a53 100%);
  --chat--toggle--active--background: linear-gradient(135deg, #d67a43 0%, #e78a53 100%);
  --chat--toggle--color: var(--chat--color-white);
  --chat--toggle--size: 64px;
  
  /* Variables adicionales para texto */
  --chat--input--text-color: #000000;
  --chat--text--color: #000000;
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

#n8n-chat-container,
[id*="n8n-chat"] {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0.015em;
}

/* Input de texto - NEGRO SÓLIDO y placeholder también negro */
#n8n-chat-container input,
#n8n-chat-container textarea,
[id*="n8n-chat"] input,
[id*="n8n-chat"] textarea,
div[id*="n8n"] input,
div[id*="n8n"] textarea {
  color: #000000 !important;
  font-weight: 600 !important;
  -webkit-text-fill-color: #000000 !important;
}

/* Placeholder en NEGRO también */
#n8n-chat-container input::placeholder,
#n8n-chat-container textarea::placeholder,
[id*="n8n-chat"] input::placeholder,
[id*="n8n-chat"] textarea::placeholder {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
  opacity: 0.6 !important;
}

/* Mensajes del usuario - FONDO Y BORDE NARANJA */
#n8n-chat-container [class*="user-message"],
[id*="n8n-chat"] [class*="user-message"],
#n8n-chat-container .n8n-chat__message--user,
[id*="n8n-chat"] .n8n-chat__message--user,
div[class*="ChatMessage"] div[class*="user"],
div[class*="message-user"] {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(231, 138, 83, 0.3) !important;
}

/* Texto del usuario NEGRO con MÁXIMA especificidad */
div[class*="chat-message"] p,
div.chat-message-markdown p,
#n8n-chat-container [class*="user-message"],
[id*="n8n-chat"] [class*="user-message"],
#n8n-chat-container [class*="user-message"] *,
[id*="n8n-chat"] [class*="user-message"] *,
#n8n-chat-container .n8n-chat__message--user,
[id*="n8n-chat"] .n8n-chat__message--user,
#n8n-chat-container .n8n-chat__message--user *,
[id*="n8n-chat"] .n8n-chat__message--user *,
#n8n-chat-container .n8n-chat__message--user p,
#n8n-chat-container .n8n-chat__message--user span,
#n8n-chat-container .n8n-chat__message--user div,
[id*="n8n-chat"] .n8n-chat__message--user p,
[id*="n8n-chat"] .n8n-chat__message--user span,
[id*="n8n-chat"] .n8n-chat__message--user div,
div[class*="message-user"],
div[class*="message-user"] *,
div[class*="message-user"] p,
div[class*="message-user"] span,
[class*="from-user"] p,
[class*="from-user"] span,
p[class*="user"],
span[class*="user"] {
  color: #000000 !important;
  -webkit-text-fill-color: #000000 !important;
}

/* Mensajes del bot - FONDO Y BORDE NARANJA */
#n8n-chat-container .n8n-chat__message--bot,
[id*="n8n-chat"] .n8n-chat__message--bot,
#n8n-chat-container [class*="bot-message"],
[id*="n8n-chat"] [class*="bot-message"] {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(231, 138, 83, 0.3) !important;
}

/* Texto del bot negro */
#n8n-chat-container .n8n-chat__message--bot *,
[id*="n8n-chat"] .n8n-chat__message--bot *,
#n8n-chat-container [class*="bot-message"] *,
[id*="n8n-chat"] [class*="bot-message"] * {
  color: #0f1014 !important;
}


/* === ESTILOS MINIMALISTAS - SOLO COLORES DE MARCA === */

/* Botón flotante - colores ZenCloud */
#n8n-chat-container button,
[id*="n8n-chat"] button,
button[class*="n8n-chat"] {
  background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%) !important;
  box-shadow: 0 4px 12px rgba(231, 138, 83, 0.4) !important;
}

#n8n-chat-container button:hover,
[id*="n8n-chat"] button:hover {
  box-shadow: 0 6px 16px rgba(231, 138, 83, 0.5) !important;
}

/* Icono del botón de enviar - blanco */
#n8n-chat-container button svg,
[id*="n8n-chat"] button svg,
#n8n-chat-container button path,
[id*="n8n-chat"] button path,
#n8n-chat-container button[type="submit"] svg,
[id*="n8n-chat"] button[type="submit"] svg,
#n8n-chat-container [class*="send"] svg,
[id*="n8n-chat"] [class*="send"] svg {
  color: #ffffff !important;
  fill: #ffffff !important;
  stroke: #ffffff !important;
}

/* Header con colores de marca */
#n8n-chat-container [class*="header"],
[id*="n8n-chat"] [class*="header"] {
  background: linear-gradient(135deg, #e78a53 0%, #f59a63 100%) !important;
}

/* Scrollbar con estilo de la app */
#n8n-chat-container ::-webkit-scrollbar,
[id*="n8n-chat"] ::-webkit-scrollbar {
  width: 8px;
}

#n8n-chat-container ::-webkit-scrollbar-thumb,
[id*="n8n-chat"] ::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(231, 138, 83, 0.6) 0%, rgba(245, 154, 99, 0.7) 100%);
  border-radius: 10px;
}
</style>
