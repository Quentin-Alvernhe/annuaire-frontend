// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      title: 'Annuaire Entreprise',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Application Annuaire Entreprise' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:8080/api'
    }
  },

  plugins: [
    '~/plugins/keyboard-shortcuts.client.ts'
  ],

  compatibilityDate: '2025-04-11'
})