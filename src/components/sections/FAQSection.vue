<template>
  <section id="faq" class="relative overflow-hidden pt-24 pb-64 sm:pb-80 md:pb-96">
    <!-- Background blur effects -->
    <div class="bg-primary/20 absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>
    <div class="bg-primary/20 absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>

    <div class="z-10 container mx-auto px-4">
      <Transition name="fade-up" appear>
        <div class="flex justify-center">
          <button
            type="button"
            class="group relative z-[60] mx-auto rounded-full border border-white/20 bg-white/5 px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
          >
            <div class="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
            <div class="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
            <span class="relative text-white font-medium">Preguntas Frecuentes</span>
          </button>
        </div>
      </Transition>

      <Transition name="fade-up" appear style="transition-delay: 200ms">
        <h2 class="mx-auto mt-6 max-w-xl text-center text-4xl font-medium text-white md:text-[54px] md:leading-[60px] tracking-tight" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">
          Preguntas? Tenemos
          <span class="text-[#e78a53] font-bold" style="text-shadow: 0 0 25px rgba(231, 138, 83, 0.7), 0 0 50px rgba(231, 138, 83, 0.5), 0 0 80px rgba(231, 138, 83, 0.3);">
            respuestas
          </span>
        </h2>
      </Transition>

      <div class="mx-auto mt-12 mb-32 flex max-w-xl flex-col gap-6">
        <Transition
          v-for="(faq, index) in faqs"
          :key="index"
          name="fade-up"
          appear
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div
            :class="[
              'from-secondary/40 to-secondary/10 rounded-2xl border border-white/10 bg-gradient-to-b p-6 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:border-white/20 cursor-pointer',
              isOpen(index) ? 'scale-105' : 'hover:scale-102',
            ]"
            @click="toggleItem(index)"
            @keydown.enter="toggleItem(index)"
            @keydown.space="toggleItem(index)"
            role="button"
            tabindex="0"
          >
            <div class="flex items-start justify-between">
              <h3 class="m-0 font-medium pr-4 text-white">{{ faq.question }}</h3>
              <Transition name="rotate" mode="out-in">
                <Minus v-if="isOpen(index)" class="text-primary flex-shrink-0 transition duration-300" :size="24" />
                <Plus v-else class="text-primary flex-shrink-0 transition duration-300" :size="24" />
              </Transition>
            </div>
            <Transition name="expand">
              <div v-if="isOpen(index)" class="mt-4 text-white/70 leading-relaxed overflow-hidden">
                {{ faq.answer }}
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Minus } from 'lucide-vue-next'

interface FAQ {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: '¿Qué es ZenCloud exactamente?',
    answer:
      'ZenCloud es una plataforma de gestión automatizada de bases de datos en la nube que te permite crear, administrar y escalar instancias de MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra desde un solo panel centralizado.',
  },
  {
    question: '¿Cómo funcionan las credenciales automáticas?',
    answer:
      'Al crear una instancia de base de datos, ZenCloud genera automáticamente credenciales seguras (usuario, contraseña, host) y te las envía por email. Las credenciales se pueden rotar automáticamente para mayor seguridad.',
  },
  {
    question: '¿Puedo usar ZenCloud para proyectos comerciales?',
    answer:
      'Sí. El plan gratuito te permite crear bases de datos para uso comercial. Para proyectos de producción, recomendamos los planes Intermedio o Avanzado con soporte prioritario y backups automáticos.',
  },
  {
    question: '¿Los webhooks son realmente ilimitados en el plan Avanzado?',
    answer:
      'Sí. El plan Avanzado incluye webhooks ilimitados para eventos de creación, eliminación, rotación de credenciales y backups. Los planes Gratuito e Intermedio tienen límites según tu plan.',
  },
  {
    question: '¿Cómo me notifican los eventos?',
    answer:
      'ZenCloud envía notificaciones por email para eventos importantes como la creación de instancias, envío de credenciales, rotación de seguridad y completado de backups. También puedes configurar webhooks personalizados.',
  },
]

const openItems = ref<number[]>([])

const toggleItem = (index: number) => {
  if (openItems.value.includes(index)) {
    openItems.value = openItems.value.filter((i) => i !== index)
  } else {
    openItems.value.push(index)
  }
}

const isOpen = (index: number) => openItems.value.includes(index)
</script>

<style scoped>
.fade-up-enter-active {
  transition: all 0.6s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.4s ease-in-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  height: 0;
  margin-top: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  height: auto;
  margin-top: 16px;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: transform 0.3s ease-in-out;
}

.rotate-enter-from {
  transform: rotate(-180deg);
}

.rotate-leave-to {
  transform: rotate(180deg);
}
</style>

