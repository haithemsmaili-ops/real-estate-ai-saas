# PropAI — Real Estate AI SaaS Platform

Modular AI-powered SaaS platform for real estate agencies, built for global markets (Gulf/Arabic and Western: US, EU, CA, AU).

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 with RTL support
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en` or `/ar`.

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # i18n routing (en, ar)
│   │   ├── page.tsx           # Landing page
│   │   └── dashboard/         # Multi-tenant agency dashboard
│   └── api/                   # API routes
│       ├── leads/qualify/     # AI lead qualification
│       ├── communication/     # WhatsApp, Email, SMS
│       ├── rag/               # Catalog ingestion & query
│       ├── ocr/verify/        # Document verification
│       └── demo-request/      # Demo lead capture
├── components/
│   ├── landing/               # Landing page sections
│   ├── dashboard/             # Dashboard widgets
│   └── ui/                    # Reusable UI primitives
├── lib/
│   ├── i18n/                  # Localization (en/ar dictionaries)
│   ├── services/
│   │   ├── lead-qualifier/    # AI intent filtering
│   │   ├── communication/     # Omnichannel (WhatsApp, SendGrid, Twilio)
│   │   ├── rag/               # Property catalog RAG bot
│   │   └── ocr/               # ID & title deed verification
│   └── db/                    # Database client (placeholder)
├── types/                     # Shared TypeScript types
└── config/                    # Site & env configuration
```

## Core Modules

| Module | Description | Integration |
|--------|-------------|-------------|
| **Lead Qualifier** | AI-driven intent scoring & routing | OpenAI / Anthropic |
| **Omnichannel** | WhatsApp (Gulf), Email/SMS (Western) | Meta Cloud API, SendGrid, Twilio |
| **RAG Catalog Bot** | Grounded property FAQ from catalogs | Vector DB + LLM |
| **OCR Verification** | ID & title deed extraction | OpenAI Vision / Document AI |

## Localization

- English (`/en`) — LTR
- Arabic (`/ar`) — RTL with Noto Sans Arabic font
- Language toggle in navbar and dashboard header

## Environment Variables

See `.env.example` for all required configuration.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private — All rights reserved.
