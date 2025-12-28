# llama-swap.wiki

Documentation website for [llama-swap](https://github.com/mostlygeek/llama-swap) - a lightweight proxy for dynamic LLM model switching.

## Technology Stack

- **11ty v3.1.2** - Static site generator
- **Tailwind CSS v4.0** - Styling with CSS-first configuration
- **Vite 7** + **React 19** - Interactive configuration builder
- **TypeScript** - Type-safe React components
- **Monaco Editor** - YAML editor with syntax highlighting

## Project Structure

```
llama-swap-wiki/
├── src/                    # 11ty source files
│   ├── _includes/         # Layout templates (Nunjucks)
│   ├── _data/            # Data files (fetches from GitHub)
│   ├── css/              # Tailwind CSS
│   ├── index.md          # Home page
│   ├── getting-started.md
│   └── examples.md
├── configuration-app/      # React app for /configuration
│   └── src/
│       ├── components/    # React components
│       ├── App.tsx
│       └── examples.ts    # Configuration examples
└── _site/                 # Build output (generated)
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

Install dependencies for both 11ty and the React app:

```bash
npm run install:all
```

Or install separately:

```bash
# 11ty dependencies
npm install

# React app dependencies
cd configuration-app && npm install
```

### Development Mode

Run the 11ty dev server:

```bash
npm run dev
```

Visit http://localhost:8989

To work on the React configuration app separately:

```bash
npm run dev:react
```

Visit http://localhost:5173 for the React app dev server.

### Build

Build the complete site:

```bash
npm run build
```

This will:
1. Build the React configuration app → `src/configuration/`
2. Build the 11ty site → `_site/`

The output in `_site/` is ready to deploy.

## Content

The site pulls content from the [llama-swap GitHub repository](https://github.com/mostlygeek/llama-swap):

- `config.example.yaml` - Example configuration (fetched at build time)
- `README.md` - Project information (fetched at build time)

## Features

### Main Site (11ty)
- Homepage with project overview
- Getting Started guide with installation instructions
- Configuration examples with syntax highlighting
- Responsive navigation
- Tailwind CSS v4 styling

### Configuration Builder (/configuration)
- Interactive YAML editor (Monaco Editor)
- 7+ example configurations:
  - Minimal setup
  - Multiple models
  - Docker/Podman
  - Macros
  - Groups & TTL
  - Aliases & API keys
  - Complete real-world example
- Download generated config.yaml
- Live editing with syntax highlighting
- Configuration tips and best practices

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
_site/
```

### Environment
- Node.js 18+

## License

MIT
