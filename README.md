# Promet Showcase

> Code sample for [Promet Source](https://www.prometsource.com) — built by Jerry Vrabel (referred by Andrew Kucharski)

A decoupled Drupal 10 + React 19 PWA demonstrating the architecture behind large-scale federal web properties. The same JSON:API + React pattern used across VA.gov, packaged as a focused, reviewable code sample.

**[→ Live Demo](https://hire-jerry-vrabel.github.io/promet-showcase)**

---

## What this demonstrates

| Concern | Implementation |
|---|---|
| Custom Drupal module | Content type, programmatic field installation, `hook_node_presave` |
| JSON:API exposure | `/jsonapi/node/promet_showcase` — Drupal's built-in, filterable, used at VA.gov scale |
| Custom REST resource | `/api/promet-showcase` — consumer-shaped flat payload, camelCase keys, cache tags |
| React PWA | Vite 7, React 19, TypeScript strict mode, CSS Modules, vite-plugin-pwa (Workbox) |
| Resilient data fetching | Live API with 6s timeout + graceful fixture fallback if sandbox is sleeping |
| CI/CD | GitHub Actions → GitHub Pages on every push to `main` |

Two API endpoints are intentional — JSON:API for the standard pattern, the custom REST resource to show consumer-shaped contract design when JSON:API's envelope is too verbose for the client.

---

## Architecture

```
Pantheon Sandbox (Drupal 10)
  └── promet_showcase module
        ├── Content type: Promet Showcase
        │     fields: title, summary, category, project_url
        ├── JSON:API     →  /jsonapi/node/promet_showcase
        └── Custom REST  →  /api/promet-showcase?_format=json
                                      │
                                (HTTP + CORS)
                                      │
GitHub Pages (React 19 PWA)
  └── useShowcaseItems hook
        ├── Live fetch from Drupal (6s timeout)
        └── Graceful fallback to fixture data
```

---

## Repo structure

```
promet-showcase/
├── drupal/
│   └── promet_showcase/              # Drupal 10 custom module
│       ├── promet_showcase.info.yml
│       ├── promet_showcase.install   # Creates content type + fields on install
│       ├── promet_showcase.module    # hook_node_presave
│       ├── config/install/
│       │   └── rest.resource.*.yml   # Auto-enables REST endpoint on module install
│       └── src/Plugin/rest/resource/
│           └── PrometShowcaseResource.php
├── react-pwa/                        # Vite 7 + React 19 + TypeScript PWA
│   ├── src/
│   │   ├── hooks/useShowcaseItems.ts
│   │   ├── components/ShowcaseCard.tsx
│   │   ├── types/showcase.ts
│   │   └── data/fixtures.ts          # Fallback sample data
│   └── vite.config.ts
└── .github/workflows/deploy.yml      # Build + deploy to GitHub Pages
```

---

## Local development

```bash
cd react-pwa
cp .env.example .env.local
# Set VITE_DRUPAL_BASE_URL to your Pantheon sandbox URL, or leave blank for fixture data
npm install
npm run dev
```

The app runs in **fallback mode** (fixture data) when `VITE_DRUPAL_BASE_URL` is empty or
the Pantheon sandbox is unreachable — the live demo always works regardless of sandbox state.

---

## Drupal module setup (Pantheon)

### 1. Create a Pantheon sandbox

Sign up at [pantheon.io](https://pantheon.io) → **Create New Site** → **Drupal 10**.

### 2. Upload and enable the module

```bash
# Switch to SFTP mode
terminus connection:set promet-showcase.dev sftp

# Upload the module
terminus rsync drupal/promet_showcase promet-showcase.dev:code/web/modules/custom/

# Enable module and dependencies
terminus drush promet-showcase.dev -- en rest serialization jsonapi promet_showcase -y
terminus drush promet-showcase.dev -- cr
```

### 3. Grant anonymous REST access

```bash
terminus drush promet-showcase.dev -- role:perm:add anonymous \
  'restful get promet_showcase_resource'
```

### 4. Configure CORS

In `sites/default/services.yml` on the Pantheon server, add:

```yaml
cors.config:
  enabled: true
  allowedOrigins:
    - 'https://hire-jerry-vrabel.github.io'
  allowedMethods:
    - GET
  allowedHeaders:
    - 'Content-Type'
    - 'Accept'
  exposedHeaders: false
  maxAge: 1000
  supportsCredentials: false
```

```bash
terminus drush promet-showcase.dev -- cr
```

### 5. Create sample content

Add a few **Promet Showcase** nodes at `/node/add/promet_showcase`, then verify:

```
https://dev-promet-showcase.pantheonsite.io/api/promet-showcase?_format=json
https://dev-promet-showcase.pantheonsite.io/jsonapi/node/promet_showcase
```

---

## Deploy to GitHub Pages

1. **Settings → Pages** → Source: **GitHub Actions**
2. **Settings → Variables → Actions** → add `VITE_DRUPAL_BASE_URL` (your Pantheon dev URL)
3. Push to `main` — the workflow builds and deploys automatically

---

## Why this stack

Promet Source builds DUSWDS and Provus — both invested in decoupled Drupal for federal clients.
This sample mirrors patterns from VA.gov:

- **JSON:API** for standard content delivery
- **Custom REST resource** for consumer-shaped payloads
- **React + TypeScript** consuming Drupal headlessly
- **PWA** with Workbox service worker for offline resilience
- **GitHub Actions** for repeatable, reviewable deployments

Intentionally small — one content type, one REST plugin. Quality over complexity.

---

## Author

**Jerry Vrabel** — Senior Web Application Developer, Chicago
[hire.jerry.vrabel@gmail.com](mailto:hire.jerry.vrabel@gmail.com) · [+1 312.961.4145](tel:+13129614145)
[github.com/hire-jerry-vrabel](https://github.com/hire-jerry-vrabel) · [linkedin.com/in/forwardslash-development](https://linkedin.com/in/forwardslash-development)
