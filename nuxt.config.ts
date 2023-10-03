const modules = (() => {
  if (process.env.NODE_ENV === 'test') {
    return []
  }
  return ['@nuxtjs/google-fonts']
})()

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
  modules: modules,
  googleFonts: {
    families: {
      Lato: true,
      Roboto: true,
      Mulish: true
    }
  },
  runtimeConfig: {
    public: {
      displayingName: process.env.DISPLAYING_NAME,
      avatarUrl: process.env.AVATAR_URL,
    }
  },
  test: process.env.NODE_ENV === 'test',
})
