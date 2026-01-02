import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

export default defineConfig({
  title: "llama-swap",
  description: "A lightweight proxy for dynamic LLM model switching",

  head: [["meta", { name: "theme-color", content: "#3b82f6" }]],

  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Tour", link: "/tour/" },
      { text: "Installation", link: "/getting-started" },
      { text: "Examples", link: "/examples" },
    ],

    sidebar: {
      "/tour/": [
        {
          text: "Configuration Tour",
          items: [
            { text: "Introduction", link: "/tour/" },
            { text: "1. Single Model", link: "/tour/01-single-model" },
            { text: "2. Multiple Models", link: "/tour/02-multiple-models" },
            { text: "3. Using Macros", link: "/tour/03-macros" },
            { text: "4. RAG Models", link: "/tour/04-rag-models" },
            { text: "5. Model Groups", link: "/tour/05-groups" },
            { text: "6. Speech (STT/TTS)", link: "/tour/06-speech" },
            { text: "7. Image Generation", link: "/tour/07-image" },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/mostlygeek/llama-swap" }],

    footer: {
      message: "A lightweight proxy for dynamic LLM model switching",
    },
  },

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
