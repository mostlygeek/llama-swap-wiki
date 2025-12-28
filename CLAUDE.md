# llama-swap.wiki Development Guide

This is the documentation website for [llama-swap](https://github.com/mostlygeek/llama-swap), built with VitePress and Vue.

## Project Overview

**Purpose**: Static documentation site with an interactive configuration builder
**Stack**: VitePress 1.5+, Vue 3, Tailwind CSS v4.0, TypeScript
**Deployment**: Static site hosted at https://llama-swap.wiki

## Project Structure

```
llama-swap-wiki/
├── docs/                           # VitePress content root
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress configuration
│   │   └── theme/
│   │       ├── index.ts           # Theme entry (registers components)
│   │       ├── style.css          # Tailwind v4 + Prism.js styles
│   │       ├── components/
│   │       │   ├── ConfigBuilder.vue   # Main config builder component
│   │       │   ├── FeatureSelector.vue # Feature checkbox list
│   │       │   └── YamlDisplay.vue     # Syntax-highlighted YAML display
│   │       └── lib/
│   │           ├── ConfigBuilder.ts    # YAML generation logic
│   │           └── config-sections.ts  # Feature definitions
│   ├── index.md                   # Homepage (VitePress home layout)
│   ├── getting-started.md         # Installation guide
│   ├── examples.md                # Configuration examples
│   └── configuration.md           # Embeds <ConfigBuilder /> component
├── package.json
└── .gitignore
```

## Common Commands

- `npm run dev` - Start VitePress dev server (auto-selects available port)
- `npm run build` - Build static site → `docs/.vitepress/dist/`
- `npm run preview` - Preview built site at http://localhost:4173

## Technology Details

### VitePress
- Content root: `docs/` directory
- Output: `docs/.vitepress/dist/`
- Uses Vue 3 for components
- Markdown with Vue component support

### Tailwind CSS v4.0
- Configuration is in CSS using `@theme` directive in `docs/.vitepress/theme/style.css`
- Use `@import "tailwindcss"` syntax
- Integrated via `@tailwindcss/vite` plugin in VitePress config

### Vue Configuration App
- Components in `docs/.vitepress/theme/components/`
- Embedded in markdown pages using `<ComponentName />`
- Uses Prism.js for YAML syntax highlighting
- State management with Vue 3 Composition API (ref, computed)

## Code Style

### Markdown Pages
- Use VitePress frontmatter:
  ```yaml
  ---
  title: Page Title
  description: Page description
  ---
  ```
- Homepage uses `layout: home` with hero and features
- Embed Vue components directly: `<ConfigBuilder />`

### Vue Components
- TypeScript with Composition API (`<script setup lang="ts">`)
- Props defined with `defineProps<{...}>()`
- Emits defined with `defineEmits<{...}>()`
- Tailwind utility classes for styling

### CSS
- All styling uses Tailwind v4 utility classes
- Custom theme variables in `@theme` block
- VitePress theme variables overridden for brand colors
- Prism.js token styles for YAML highlighting

## Vue Components

### ConfigBuilder.vue
Main component that orchestrates the configuration builder:
- State: `selectedFeatures`, `highlightedFeature`
- Handles feature toggle, download, and copy functionality
- Two-column layout: sidebar + YAML display

### FeatureSelector.vue
Checkbox list for selecting configuration features:
- Props: `selectedFeatures: Set<string>`
- Emits: `toggle`, `download`
- 7 features: ttl, macros, groups, apiKeys, docker, hooks, env

### YamlDisplay.vue
Syntax-highlighted YAML display with line highlighting:
- Props: `value`, `lineFeatures`, `highlightedFeature`
- Uses Prism.js for highlighting
- Animated yellow highlight when features are added
- Auto-scrolls to highlighted section

## Testing Changes

```bash
# Development
npm run dev
# Visit the auto-assigned port (shown in terminal)
# Test all pages: /, /getting-started, /examples, /configuration
# Verify ConfigBuilder component works

# Production build
npm run build
npm run preview
# Visit http://localhost:4173
```

## Common Issues

### CSS Not Loading
- Check `docs/.vitepress/theme/style.css` has `@import "tailwindcss"`
- Verify `@tailwindcss/vite` is in VitePress config

### Component Not Rendering
- Ensure component is registered in `docs/.vitepress/theme/index.ts`
- Check component import path is correct
- Vue components must be in `.vue` files

### Build Errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors in Vue components

## Git Workflow

- `.gitignore` excludes: `node_modules/`, `docs/.vitepress/cache/`, `docs/.vitepress/dist/`
- Build output is regenerated, never commit dist
- Keep commit messages clear and to the point
- Never add "Co-Authored-By" or "Generated with" lines to commit messages

## Deployment

**Build command**: `npm run build`
**Output directory**: `docs/.vitepress/dist/`
**Node version**: 18+

The site is static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting

## External Resources

- llama-swap repo: https://github.com/mostlygeek/llama-swap
- VitePress docs: https://vitepress.dev/
- Vue 3 docs: https://vuejs.org/
- Tailwind v4 docs: https://tailwindcss.com/
