# andersonmagalhaes.dev

Personal site and developer toolkit for **Anderson Magalhaes** — Software Engineer with 15+ years of experience. Built as a static Next.js application, fully bilingual (EN / BR), and packed with browser-based developer tools.

> Live: [andersonmagalhaes.dev](https://andersonmagalhaes.dev)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, static export) |
| Language | **TypeScript** (strict) |
| Styling | **Tailwind CSS v4** with a custom dark theme |
| Animations | **Framer Motion** (scroll reveals, hero, loader) |
| i18n | **next-intl** (`/en/` and `/br/` routes, fully static) |
| Icons | **Phosphor Icons** |
| Hosting | **Hostinger** (Apache `.htaccess` routing) |

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

```bash
npm install
npm run dev          # http://localhost:3000
```

Build the static site:

```bash
npm run build        # outputs to ./out
```

The `postbuild` script copies `.htaccess` into `out/` so the bundle can be uploaded as-is to Hostinger `public_html`.

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/                # Localized routes (en, br)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Landing page
│   │   ├── base64-translator/
│   │   ├── uuid4/
│   │   ├── uuid-from-string/
│   │   ├── password-generator/
│   │   ├── easy-crontab/
│   │   ├── jwt-validator/
│   │   ├── json-validator/
│   │   └── text-compare/
│   ├── layout.tsx               # Root layout (fonts, base metadata)
│   └── page.tsx                 # Redirects to /en/
├── components/
│   ├── layout/                  # Header, Footer, ToolLayout, LoadingScreen
│   ├── sections/                # Hero, About, Experience, ...
│   └── ui/                      # Button, Badge, Card, CopyButton, ...
├── data/                        # experience, projects, skills, social
├── hooks/                       # useActiveSection, useCopyToClipboard
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── messages/
│       ├── en.json
│       └── br.json
└── lib/cn.ts
```

---

## Notes

- All routes are statically generated (`output: "export"`).
- All developer tools run client-side only — no API routes, no server, no telemetry.
- Hydration-safe: anything that depends on `crypto.randomUUID()`, `new Date()` or locale-specific formatting runs inside `useEffect`.
- The "decrypting" loader on first visit is gated by `sessionStorage` so it only plays once per tab.
