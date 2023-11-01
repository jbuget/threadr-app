import { resolve } from "node:path"

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
  modules: ['@hebilicious/authjs-nuxt', ...modules],
  googleFonts: {
    families: {
      Lato: true,
      Roboto: true,
      Mulish: true
    }
  },
  runtimeConfig: {
    authJs: {
      secret: process.env.NUXT_NEXTAUTH_SECRET // You can generate one with `openssl rand -base64 32`
    },
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET
    },
    public: {
      displayingName: process.env.DISPLAYING_NAME,
      avatarUrl: process.env.AVATAR_URL,
      authJs: {
        baseUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
        verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
      }
    }
  },
  test: process.env.NODE_ENV === 'test',
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie")
  }
})
