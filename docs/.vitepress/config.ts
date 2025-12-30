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
      { text: "Getting Started", link: "/getting-started" },
      { text: "Examples", link: "/examples" },
      { text: "Config Builder", link: "/configuration" },
    ],

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
