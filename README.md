# llama-swap.wiki

Documentation website for [llama-swap](https://github.com/mostlygeek/llama-swap) - a lightweight proxy for dynamic LLM model switching.

## Technology Stack

- **VitePress 1.5+** - Static site generator with Vue 3
- **Vue 3** - Interactive components with Composition API
- **Tailwind CSS v4.0** - Styling with CSS-first configuration
- **TypeScript** - Type-safe components
- **Prism.js** - YAML syntax highlighting

## Project Structure

```
llama-swap-wiki/
├── docs/                           # VitePress content root
│   ├── .vitepress/
│   │   ├── config.ts              # VitePress configuration
│   │   └── theme/
│   │       ├── index.ts           # Theme entry (registers components)
│   │       ├── style.css          # Tailwind v4 + Prism.js styles
│   │       ├── components/        # Vue components
│   │       └── lib/               # Config builder logic
│   ├── index.md                   # Homepage
│   ├── getting-started.md         # Installation guide
│   ├── examples.md                # Configuration examples
│   └── configuration.md           # Interactive config builder
└── package.json
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The dev server will start on an available port (shown in terminal).

### Build

```bash
npm run build
```

Output: `docs/.vitepress/dist/`

### Preview Production Build

```bash
npm run preview
```

Visit http://localhost:4173

## Features

- Homepage with project overview
- Getting Started guide with installation instructions
- Configuration examples with syntax highlighting
- Interactive Configuration Builder with:
  - Feature selection checkboxes
  - Live YAML preview with syntax highlighting
  - Line highlighting when features are toggled
  - Download and copy functionality

## Deployment

The site is a static build that can be deployed to:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Cloudflare Pages**
- Any static hosting service

### Build Command
```bash
npm run build
```

### Output Directory
```
docs/.vitepress/dist/
```

### Environment
- Node.js 18+

## License

MIT
