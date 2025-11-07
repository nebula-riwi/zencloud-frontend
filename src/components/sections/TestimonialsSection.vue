<template>
  <section id="testimonials" class="mb-24">
    <div class="mx-auto max-w-7xl">
      <div class="mx-auto max-w-[540px]">
        <div class="flex justify-center">
          <button
            type="button"
            class="group relative z-10 mx-auto rounded-full border border-white/20 bg-white/5 px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
          >
            <div class="absolute inset-x-0 -top-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
            <div class="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-[#e78a53] to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
            <span class="relative text-white font-medium">Testimonios</span>
          </button>
        </div>
        <h2 class="mt-5 text-center text-4xl font-semibold tracking-tight text-white md:text-[54px] md:leading-[60px] relative z-10" style="text-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 60px rgba(255, 255, 255, 0.2);">
          Lo que dicen nuestros usuarios
        </h2>

        <p class="mt-5 relative z-10 text-center text-lg text-white/60 leading-relaxed">
          Desde desarrolladores independientes hasta equipos grandes, ZenCloud está transformando la gestión de bases de datos en la nube.
        </p>
      </div>

      <div class="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <div>
          <Marquee pause-on-hover vertical :duration="20">
            <TestimonialCard
              v-for="testimonial in firstColumn"
              :key="testimonial.username"
              :img="testimonial.img"
              :name="testimonial.name"
              :username="testimonial.username"
              :body="testimonial.body"
            />
          </Marquee>
        </div>

        <div class="hidden md:block">
          <Marquee reverse pause-on-hover vertical :duration="25">
            <TestimonialCard
              v-for="testimonial in secondColumn"
              :key="testimonial.username"
              :img="testimonial.img"
              :name="testimonial.name"
              :username="testimonial.username"
              :body="testimonial.body"
            />
          </Marquee>
        </div>

        <div class="hidden lg:block">
          <Marquee pause-on-hover vertical :duration="30">
            <TestimonialCard
              v-for="testimonial in thirdColumn"
              :key="testimonial.username"
              :img="testimonial.img"
              :name="testimonial.name"
              :username="testimonial.username"
              :body="testimonial.body"
            />
          </Marquee>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Marquee from '@/components/common/Marquee.vue'

interface Testimonial {
  name: string
  username: string
  body: string
  img: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Carlos Mendoza',
    username: '@carlosmendoza',
    body: 'ZenCloud me permitió desplegar bases de datos para mis proyectos en minutos. La integración fue súper simple.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Ana Rodríguez',
    username: '@anarodriguez',
    body: 'Excelente servicio. Los webhooks nos ayudan a automatizar todo nuestro flujo de trabajo con las bases de datos.',
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Miguel Torres',
    username: '@migueltorres',
    body: 'ZenCloud es la mejor plataforma para gestionar múltiples bases de datos. El soporte es rápido y confiable.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Laura Gómez',
    username: '@lauragomez',
    body: 'Desde que uso ZenCloud, el tiempo de desarrollo se redujo a la mitad. Las credenciales automáticas son un must.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'David Ruiz',
    username: '@davidruiz',
    body: 'Crear instancias de PostgreSQL, MySQL y MongoDB en un solo lugar es increíble. 100% recomendado.',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Sofia Martínez',
    username: '@sofiamartinez',
    body: 'La interfaz es clara y las características son impresionantes. La rotación de credenciales me da mucha tranquilidad.',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Javier López',
    username: '@javierlopez',
    body: 'Como freelancer, ZenCloud me permite escalar mis proyectos sin preocupaciones de infraestructura. Genial.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Carmen Vidal',
    username: '@carmenvidal',
    body: 'El plan gratuito de ZenCloud me permitió probar todo antes de comprometerme. Ahora estoy en el plan intermedio.',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Roberto Silva',
    username: '@robertosilva',
    body: 'Los backups automáticos del plan avanzado salvaron mi proyecto cuando tuve un problema. Invaluable.',
    img: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
  },
]

const firstColumn = computed(() => testimonials.slice(0, 3))
const secondColumn = computed(() => testimonials.slice(3, 6))
const thirdColumn = computed(() => testimonials.slice(6, 9))
</script>

<script lang="ts">
import TestimonialCard from './TestimonialCard.vue'

export default {
  components: {
    TestimonialCard,
  },
}
</script>

