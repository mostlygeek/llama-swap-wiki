# llama-swap.wiki Development Guide

This is the documentation website for [llama-swap](https://github.com/mostlygeek/llama-swap), built with 11ty and React.

## Project Overview

**Purpose**: Static documentation site with an interactive configuration builder
**Stack**: 11ty v3.1.2, Tailwind CSS v4.0, Vite 7, React 19, TypeScript
**Deployment**: Static site hosted at https://llama-swap.wiki
**Content Source**: Fetches from https://github.com/mostlygeek/llama-swap at build time

## Project Structure

```
llama-swap-wiki/
├── src/                        # 11ty source files
│   ├── _includes/             # Nunjucks templates (base.njk, nav.njk)
│   ├── _data/                 # Data files (config.js fetches from GitHub)
│   ├── css/styles.css         # Tailwind v4 (processed via PostCSS)
│   ├── index.md               # Homepage
│   ├── getting-started.md     # Installation guide
│   └── examples.md            # Configuration examples
├── configuration-app/          # React app for /configuration route
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── components/       # YamlEditor, ExampleSelector, ConfigValidator
│   │   └── examples.ts       # Configuration examples data
│   ├── vite.config.ts        # Builds to ../src/configuration/
│   └── postcss.config.mjs    # Tailwind v4 PostCSS config
├── .eleventy.js               # 11ty config with PostCSS integration
├── postcss.config.mjs         # Root PostCSS config
└── _site/                     # Build output (gitignored)
```

## Common Commands

- `npm run dev` - Start 11ty dev server at http://localhost:8989
- `npm run build` - Build React app, then build 11ty site → `_site/`
- `npm run build:react` - Build only the React configuration app
- `npm run dev:react` - Start React dev server at http://localhost:5173
- `npm run install:all` - Install deps for both 11ty and React app

## Technology Details

### 11ty v3.1.2
- Input: `src/` directory
- Output: `_site/` directory
- Templates: Nunjucks (.njk) and Markdown (.md)
- Port: 8989 (configured in `.eleventy.js`)
- Data files: JavaScript modules that export data/functions

### Tailwind CSS v4.0
IMPORTANT: Tailwind v4 has significant changes from v3:
- No `tailwind.config.js` - configuration is in CSS using `@theme` directive
- Use `@import "tailwindcss"` instead of `@tailwind` directives
- PostCSS plugin is now `@tailwindcss/postcss` (not `tailwindcss`)
- No `autoprefixer` needed (handled automatically)
- CSS is processed through PostCSS in `.eleventy.js` using `addExtension("css")`

### React Configuration App
- Built with Vite 7 + React 19 + TypeScript
- Output: `src/configuration/` (then copied by 11ty to `_site/configuration/`)
- Uses Monaco Editor for YAML editing
- Base path: `/configuration/` (set in vite.config.ts)
- Includes 7 example configurations (minimal, docker, macros, groups, etc.)

## Code Style

### 11ty Templates
- Use Nunjucks (.njk) for layouts in `src/_includes/`
- Use Markdown (.md) for content pages with frontmatter:
  ```yaml
  ---
  layout: base.njk
  title: Page Title
  ---
  ```
- Access data with `{{ config.variableName }}`
- Use `| safe` filter for HTML content: `{{ content | safe }}`

### React Components
- TypeScript strict mode enabled
- Functional components with hooks
- Props interfaces defined inline or separately
- Tailwind utility classes for styling
- Component files in `configuration-app/src/components/`

### CSS
- All styling uses Tailwind v4 utility classes
- Custom theme variables in `@theme` block
- Avoid writing custom CSS unless absolutely necessary
- Tailwind processes automatically during build

## Important Behaviors

### Content Fetching
- `src/_data/config.js` fetches config.example.yaml and README.md from GitHub at build time
- Data is available in all templates as `{{ config.example }}` and `{{ config.readme }}`
- Errors are caught and fallback messages provided

### Build Process
1. React app builds first → `src/configuration/`
2. 11ty builds → `_site/` (copies React build via passthrough)
3. CSS is processed through PostCSS during 11ty build

### CSS Processing
IMPORTANT: CSS must be processed by PostCSS during 11ty build:
- `.eleventy.js` uses `addExtension("css")` to process `src/css/styles.css`
- PostCSS processes Tailwind v4 imports and theme
- Output: `_site/css/styles.css` (fully compiled)

## Testing Changes

### Test 11ty Site
```bash
npm run build
# Check _site/ for generated files
# Verify CSS exists at _site/css/styles.css
```

### Test React App
```bash
npm run dev:react
# Visit http://localhost:5173
# Test YAML editor, example selector, download button
```

### Test Complete Site
```bash
npm run dev
# Visit http://localhost:8989
# Test all pages: /, /getting-started/, /examples/, /configuration/
# Verify navigation works
# Check CSS is loading (responsive nav, styled content)
```

## Common Issues

### CSS Not Loading
- Ensure PostCSS is processing CSS in `.eleventy.js`
- Check `_site/css/styles.css` exists and is not empty
- Verify `@import "tailwindcss"` is in `src/css/styles.css`
- Check PostCSS config uses `@tailwindcss/postcss`

### React App Not Building
- Ensure `vite.config.ts` has correct `outDir: '../src/configuration'`
- Check `base: '/configuration/'` is set
- Verify all dependencies installed in `configuration-app/`

### Port Conflicts
- 11ty dev server uses port 8989 (configurable in `.eleventy.js`)
- React dev server uses default Vite port 5173
- Change in both `.eleventy.js` and package.json scripts if needed

### Styling Synchronization
The React configuration app and main 11ty site have separate CSS bundles but should look identical.

**Files that must stay synchronized**:
- **CSS Theme**: `src/css/styles.css` @theme ↔ `configuration-app/src/index.css` @theme
- **Navigation**: `src/_includes/nav.njk` ↔ `configuration-app/src/components/Navigation.tsx`
- **Footer**: `src/_includes/base.njk` footer ↔ `configuration-app/src/components/Footer.tsx`

When updating these components, apply changes to both locations and rebuild React app with `npm run build:react`.

## Git Workflow

- Commit both `CLAUDE.md` and `CLAUDE.local.md` (if used)
- `.gitignore` excludes: `node_modules/`, `_site/`, `dist/`, `configuration-app/dist/`
- Build output is regenerated, never commit `_site/`
- Never mention Claude or Co-authored-by.
- Keep commit messages clear and to the point

## Deployment

**Build command**: `npm run build`
**Output directory**: `_site/`
**Node version**: 18+

The site is static and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting

## External Resources

- llama-swap repo: https://github.com/mostlygeek/llama-swap
- 11ty docs: https://www.11ty.dev/docs/
- Tailwind v4 docs: https://tailwindcss.com/blog/tailwindcss-v4
- Vite docs: https://vite.dev/guide/
