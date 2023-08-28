// @ts-nocheck
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@/assets/css/main.css',
  ],
  modules: ['@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Lato: true,
      Roboto: true,
      Mulish: true
    }
  }

})
