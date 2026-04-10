# andersonmagalhaes.dev

![Coverage](https://img.shields.io/badge/coverage-96%25-brightgreen)

Personal site and developer toolkit for **Anderson Magalhaes** — Software Engineer with 15+ years of experience. Built as a static Next.js application, fully bilingual (EN / BR), and packed with browser-based developer tools.

> Live: [andersonmagalhaes.dev](https://andersonmagalhaes.dev)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, static export) |
| Language | **TypeScript** (strict) |
| Styling | **Vanilla CSS** — design tokens (`src/styles/tokens.css`) + CSS Modules per component |
| Component workshop | **Storybook 10** (`@storybook/nextjs`) |
| Animations | **Framer Motion** (scroll reveals, hero, loader) |
| i18n | **next-intl** (`/en/` and `/br/` routes, fully static) |
| Icons | **Phosphor Icons** |
| Hosting | **Hostinger** (Apache `.htaccess` routing) |
| Task runner | **Makefile** wrapping the npm scripts |

Color palette: orange `#F97316`, emerald `#10B981`, black `#0A0A0A`.
Typography: `JetBrains Mono` (code/identity) + `Inter` (body).

---

## Landing Page

The home page is a single-scroll experience composed of six animated sections, with a fixed translucent header, smooth-scroll navigation, active-section tracking, and a "decrypting" loading screen on first visit.

### Hero
A full-viewport introduction with the name displayed in monospace orange, animated gradient blobs and floating dots in the background, social links, and dual CTAs that scroll to Projects or Contact.

![Hero](docs/screenshots/01-hero.png)

### About
A short biography paired with emerald highlight badges summarizing the core specializations: Project Lead, Fullstack, Backend, Infra & Quality, SAST & DAST.

![About](docs/screenshots/02-about.png)

### Experience
A vertical timeline (emerald rail, orange nodes) listing professional roles. Each entry is a hover-aware card with role, company, period, current/past badge, description and tech stack chips.

![Experience](docs/screenshots/03-experience.png)

### Projects
A responsive 2-column grid containing the public GitHub repositories alongside each developer tool shipped on this site — every tool doubles as a portfolio item.

![Projects](docs/screenshots/04-projects.png)

### Skills
Skills grouped by category — Languages, Frameworks, Infrastructure, Tools & Practices, Security — with alternating orange/emerald accents.

![Skills](docs/screenshots/05-skills.png)

### Contact
Direct links to GitHub, LinkedIn and Medium. No form, no backend — just clear channels.

![Contact](docs/screenshots/06-contact.png)

---

## Developer Tools

Eight self-contained, client-side utilities. Each lives at its own route under `/{locale}/<tool>/`, runs entirely in the browser with zero network calls, and shares a consistent layout and copy-to-clipboard UX.

### Base64 Translator — `/base64-translator/`
Encode and decode Base64 strings with full UTF-8 support. Side-by-side input/output, dedicated encode and decode buttons, error handling for invalid input.

![Base64 Translator](docs/screenshots/07-tool-base64.png)

### UUID4 Generator — `/uuid4/`
Generate random UUID v4 identifiers using the native `crypto.randomUUID()` API. Includes a bulk mode for generating up to 100 UUIDs at once with per-row copy buttons.

![UUID4 Generator](docs/screenshots/08-tool-uuid4.png)

### UUID from String — `/uuid-from-string/`
Deterministic UUID v5 generator from any input string, using the standard DNS, URL, OID and X500 namespaces. Implemented with `SubtleCrypto` SHA-1 and zero dependencies. Auto-generates as you type.

![UUID from String](docs/screenshots/09-tool-uuid-from-string.png)

### Password Generator — `/password-generator/`
Cryptographically secure password generator using `crypto.getRandomValues()`. Length slider (8–128), toggleable character sets (uppercase, lowercase, numbers, symbols) and a real-time strength indicator.

![Password Generator](docs/screenshots/10-tool-password.png)

### Easy Crontab — `/easy-crontab/`
Visual cron expression builder with five-field input, human-readable description (fully translated), preset shortcuts, and a preview of the next 5 execution times.

![Easy Crontab](docs/screenshots/11-tool-crontab.png)

### JWT Validator — `/jwt-validator/`
Decode and inspect JSON Web Tokens. Splits the token into Header, Payload and Signature sections, formats the JSON, and reports expiration status. Powered by the `jose` library.

![JWT Validator](docs/screenshots/12-tool-jwt.png)

### JSON Validator — `/json-validator/`
Validate, format and minify JSON. Live error reporting with line numbers, prettified output in a monospace block, copy button on the result.

![JSON Validator](docs/screenshots/13-tool-json.png)

### Text Compare — `/text-compare/`
Side-by-side text diff using the `diff` library. Highlights added lines in emerald, removed in red, with line numbers. Toggle between unified and split views.

![Text Compare](docs/screenshots/14-tool-text-compare.png)

---

## Bilingual (EN / BR)

The entire site — UI strings, project descriptions, experience entries, tool labels, and even the cron description engine — is translated. Switching languages from any page preserves the current route (e.g. `/en/text-compare/` ⇄ `/br/text-compare/`).

![Portuguese locale](docs/screenshots/15-locale-br.png)

The "Tools" dropdown in the header gives quick access to every utility, also localized:

![Tools dropdown](docs/screenshots/16-tools-dropdown.png)

---

## Running Locally

A `Makefile` wraps every common task — run `make` (or `make help`) to list them.

```bash
make install         # install dependencies
make dev             # Next.js dev server  → http://localhost:3000
make storybook       # Storybook dev server → http://localhost:6006
make build           # static export to ./out (postbuild copies .htaccess)
make lint            # ESLint
make test            # Vitest unit tests (When/Then specs in src/lib)
make coverage        # Vitest with coverage (text + html in ./coverage)
make check           # lint + tests + next build + storybook build (CI gate)
make clean           # rm -rf .next out storybook-static coverage
```

The plain `npm run …` scripts still work — `make` is just a thin convenience layer.

The `postbuild` step copies `.htaccess` into `out/` so the bundle can be uploaded as-is to Hostinger `public_html`.

## Styling architecture

There is no Tailwind, no PostCSS plugin, no utility-class soup. Everything is plain CSS, organized in two layers:

```
src/styles/
├── tokens.css      # ← single source of truth: colors, spacing, fonts,
│                   #   radii, shadows, transitions, breakpoints, z-index
└── globals.css     # @imports tokens; reset, body, scrollbar, shared
                    # layout utilities (.container, .container-tool, .section)
```

To restyle the site you only edit `tokens.css` — every component reads from CSS variables, so a single value change cascades everywhere.

Each component owns a co-located **CSS Module** (`Button.module.css`, `Header.module.css`, …). Tool clients additionally share `src/app/[locale]/tools.module.css` which exposes reusable primitives — `.panel`, `.field`, `.input`, `.textarea`, `.eyebrow`, `.errorBox`, `.actionRow` and friends — so the eight tool pages stay DRY without duplicating layout decisions.

The `cn()` helper in `src/lib/cn.ts` is a one-line `clsx` wrapper for combining module class names conditionally.

---

## Storybook

Every component lives in **Storybook 10** (`@storybook/nextjs`) so it can be developed, reviewed and demoed in isolation. Stories cover the three component layers — `ui/`, `layout/` and `sections/` — and the preview is wired with Tailwind v4, the dark theme background, and a `NextIntlClientProvider` decorator that uses the real `en.json` / `br.json` message bundles. A locale switcher in the toolbar lets you flip every story between English and Portuguese.

```bash
npm run storybook         # http://localhost:6006
npm run build-storybook   # static build into ./storybook-static
```

### UI primitives

| | |
|---|---|
| `Button` — variants, sizes, disabled | `Badge` — orange / emerald / gray |
| ![Button stories](docs/screenshots/storybook/01-button.png) | ![Badge stories](docs/screenshots/storybook/02-badge.png) |
| `Card` — base container used across the site | `ToolLayout` — shared shell for every developer tool |
| ![Card story](docs/screenshots/storybook/03-card.png) | ![ToolLayout story](docs/screenshots/storybook/09-tool-layout.png) |

### Layout

The fixed header is rendered with the Next.js navigation mock, including the active-section state and the Tools dropdown.

![Header story](docs/screenshots/storybook/04-header.png)

### Sections

Every landing-page section is a standalone story, rendered against the live `next-intl` messages.

![HeroSection story](docs/screenshots/storybook/05-hero-section.png)

![ProjectsSection story](docs/screenshots/storybook/06-projects-section.png)

![ExperienceSection story](docs/screenshots/storybook/07-experience-section.png)

![SkillsSection story](docs/screenshots/storybook/08-skills-section.png)

### Locale switching

The same `Hero` story rendered with the toolbar locale flipped to **Português (BR)** — proof that the `NextIntlClientProvider` decorator picks up the active globals.

![HeroSection in Portuguese](docs/screenshots/storybook/10-locale-br.png)

---

## Project Structure

```
.
├── Makefile                     # task runner (make help)
├── .storybook/
│   ├── main.ts
│   ├── preview.tsx              # globals.css + NextIntlClientProvider decorator
│   └── preview-head.html        # loads Inter + JetBrains Mono for Storybook
├── src/
│   ├── styles/
│   │   ├── tokens.css           # design tokens (single source of truth)
│   │   └── globals.css          # reset + .container/.section utilities
│   ├── app/
│   │   ├── [locale]/            # Localized routes (en, br)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx         # Landing page
│   │   │   ├── tools.module.css # shared CSS primitives for every tool
│   │   │   ├── base64-translator/  (client.tsx + Base64.module.css)
│   │   │   ├── uuid4/              (client.tsx + Uuid4.module.css)
│   │   │   ├── uuid-from-string/   (client.tsx + UuidFromString.module.css)
│   │   │   ├── password-generator/ (client.tsx + Password.module.css)
│   │   │   ├── easy-crontab/       (client.tsx + Crontab.module.css)
│   │   │   ├── jwt-validator/      (client.tsx + Jwt.module.css)
│   │   │   ├── json-validator/     (client.tsx + Json.module.css)
│   │   │   └── text-compare/       (client.tsx + TextCompare.module.css)
│   │   ├── layout.tsx           # Root layout (fonts, base metadata)
│   │   └── page.tsx             # Redirects to /en/
│   ├── components/              # each component co-locates a .module.css
│   │   │                        # and a .stories.tsx
│   │   ├── layout/              # Header, Footer, ToolLayout, LoadingScreen
│   │   ├── sections/            # Hero, About, Experience, ...
│   │   └── ui/                  # Button, Badge, Card, CopyButton, ...
│   ├── data/                    # experience, projects, skills, social
│   ├── hooks/                   # useActiveSection, useCopyToClipboard
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── messages/{en,br}.json
│   └── lib/cn.ts                # one-line clsx wrapper
```

---

## Notes

- All routes are statically generated (`output: "export"`).
- All developer tools run client-side only — no API routes, no server, no telemetry.
- Hydration-safe: anything that depends on `crypto.randomUUID()`, `new Date()` or locale-specific formatting runs inside `useEffect`.
- The "decrypting" loader on first visit is gated by `sessionStorage` so it only plays once per tab.
