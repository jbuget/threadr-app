// @ts-nocheck
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true
  },
  css: [
    '@/assets/css/main.css',
    '@/assets/scss/main.scss',
    'primevue/resources/themes/lara-light-blue/theme.css'
  ],
  build: {
    transpile: ["primevue"]
  },
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Lato: true,
      Roboto: true,
      Mulish: true
    }
  },
})
