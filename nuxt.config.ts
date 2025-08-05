// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width' },
        { name: 'theme-color', content: '#000' },
        { name: 'apple-mobile-web-app-title', content: 'S•T•L' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  hooks: {
    'build:done': async () => {
      await import('./scripts/copy-mustache-templates').then((mod) => mod.copyMustacheTemplates?.());
    }
  },

  css: ['~/assets/css/index.css'],
  devtools: { enabled: true },
  modules: [
    '@tresjs/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-svgo',
    '@nuxt/image',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    'nuxt-graphql-request',
    'lenis/nuxt',
    '@pinia/nuxt',
    '@dargmuesli/nuxt-cookie-control'
  ],

  components: [
    { path: '~/components', pathPrefix: true },
    { path: '~/components/ui', pathPrefix: false }
  ],

  nitro: {
    prerender: {
      routes: ['/', '/resume', '/contact', '/projects/battleship']
    }
  },

  runtimeConfig: {
    public: {
      githubUsername: process.env.GITHUB_USERNAME,
      mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
      contentful: {
        endpoint: process.env.CONTENTFUL_API_ENDPOINT,
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        entryIds: {
          header: process.env.CONTENTFUL_HEADER_ENTRY_ID,
          about: process.env.CONTENTFUL_ABOUT_ENTRY_ID,
          mantra: process.env.CONTENTFUL_MANTRA_ENTRY_ID,
          activity: process.env.CONTENTFUL_ACTIVITY_ENTRY_ID,
          footer: process.env.CONTENTFUL_FOOTER_ENTRY_ID,
          resume: process.env.CONTENTFUL_RESUME_ENTRY_ID,
          board: process.env.CONTENTFUL_BOARD_ENTRY_ID,
          contact: process.env.CONTENTFUL_CONTACT_ENTRY_ID,
          journey: process.env.CONTENTFUL_JOURNEY_ENTRY_ID,
          error: process.env.CONTENTFUL_ERROR_ENTRY_ID,
          project: process.env.CONTENTFUL_BATTLESHIP_ENTRY_ID,
          projects: process.env.CONTENTFUL_PROJECTS_ENTRY_ID,
          cookies: process.env.CONTENTFUL_COOKIE_ENTRY_ID
        }
      },

      enableLLM: true,
      defaultLLMProvider: 'openai',
      defaultAIStrategy: 'llm',

      openaiEnabled: process.env.OPENAI_ENABLED,
      anthropicEnabled: process.env.ANTHROPIC_ENABLED,
      googleAiEnabled: process.env.GOOGLE_AI_ENABLED
    },
    private: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      googleAiApiKey: process.env.GOOGLE_AI_API_KEY
    }
  },

  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'en-US', language: 'English' },
      { code: 'uk', language: 'Ukrainian' }
    ],
    lazy: true,
    defaultLocale: 'en-US'
  },

  svgo: {
    svgo: false,
    autoImportPath: '~/assets/icons/',
    defaultImport: 'component'
  },

  tres: {
    devtools: !!process.env.DEV,
    glsl: true
  },

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true
  },

  compatibilityDate: '2025-02-11'
});
