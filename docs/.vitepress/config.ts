import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  title: 'llama-swap',
  description: 'A lightweight proxy for dynamic LLM model switching',

  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Examples', link: '/examples' },
      { text: 'Configuration', link: '/configuration' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mostlygeek/llama-swap' }
    ],

    footer: {
      message: 'A lightweight proxy for dynamic LLM model switching'
    }
  },

  vite: {
    plugins: [tailwindcss()]
  }
})
