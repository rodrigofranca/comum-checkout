# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<instructions>
SEMPRE SIGA @.cursor/rules/instructions.mdc
</instructions>

## Commands

### Development (SvelteKit App)
```bash
# Navigate to app directory
cd app

# Install dependencies  
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm check

# Type checking with watch mode
pnpm check:watch

# Run Storybook
pnpm storybook
```

### Root Project (Scripts and Utilities)
```bash
# Install root dependencies
pnpm install

# Image optimization scripts
cd scripts/optimize-images && node index.js

# Google Drive image import
cd scripts/import-drive-images && node import-drive-images.js

# Clean inventory images
node scripts/clean-inventory-images.js

# Populate/list tags
node scripts/populate-tags.js
node scripts/list-tags.js
```

## Project Architecture

### Overview
**Checkout Comum** is a POC checkout system for thrift stores ("brechós") at fairs and events. The system targets sub-90-second transactions with visual inventory selection and automated receipt generation.

### Dual-Layer Structure
- **Root**: Node.js utilities for data management, image processing, and PocketBase scripts
- **App**: SvelteKit frontend with checkout interface

### Core Technology Stack

**Frontend (SvelteKit 5)**
- **Framework**: SvelteKit with TypeScript
- **State**: Svelte 5 runes ($state) - no traditional stores
- **Styling**: Tailwind CSS + DaisyUI with custom "tropical-light" theme
- **HTTP Client**: PocketBase JavaScript SDK

**Backend Services**
- **Database**: PocketBase (hosted at api.acervocomum.com.br)
- **Automation**: n8n workflows for receipts and Google Sheets sync
- **Image Storage**: PocketBase file storage with optimization scripts

### Key Business Logic

**Product Management**
- Products synced from Google Sheets to PocketBase `inventory` collection
- Status tracking: `disponivel` | `vendido`
- Image optimization and import via root scripts

**Checkout Flow** (Per ADR-001)
- Visual inventory grid (prioritized over QR codes for POC)
- Search and filtering capabilities
- Cart management with Svelte 5 runes
- Dual discount system: fixed amount (R$) + percentage (%) per ADR-002

**Data Models**
```typescript
interface Product {
  id: string;
  codigo: string;
  nome: string;
  preco: number;
  status: 'disponivel' | 'vendido';
  foto_url?: string;
  categoria?: string;
  descricao?: string;
}
```

## Development Guidelines

### Svelte 5 Patterns (Critical)
- Use `$state` for reactive values (never traditional stores)
- Use `onclick` instead of `on:click` 
- Runes in TypeScript files require `.svelte.ts` extension
- Always use `let` when creating `$state` values

### Styling System
- DaisyUI semantic classes: `btn-primary`, `card`, `input-bordered`
- Custom tropical theme with ocean/coral palette (see `app/docs/TROPICAL_THEME.md`)
- Avoid hardcoded Tailwind colors, prefer theme tokens
- **Tailwind Opacity Syntax**: Use `bg-color/opacity` format (e.g., `bg-neutral/50`, `text-primary/80`) instead of deprecated `bg-opacity-*` classes

### File Organization
- Main app development in `/app`
- Test routes follow `/app/src/routes/test` pattern
- Image handling documented in `/app/docs/INVENTORY_API.md`
- Utilities and scripts in root `/scripts`

### Development Process (From Cursor Rules)
1. Always respond in Portuguese (pt-br)
2. Create implementation plan before coding
3. Break work into discrete tasks
4. Execute one task at a time, never auto-advance
5. Use `@todos-template.mdc` and `@implementation-plan-template.mdc` for planning

### Architecture Decisions
Key ADRs in `docs_ia/`:
- **ADR-001**: Visual inventory listing prioritized over QR codes for POC speed
- **ADR-002**: Dual discount system (fixed R$ + percentage %) for vendor flexibility

### Business Context & Success Metrics
- Target: <90 seconds per transaction
- Goal: 99% uptime during events
- Email capture: ≥30% of sales
- Eliminate manual calculation errors
- Real-time inventory status updates

### Component Structure
```
app/src/lib/components/
├── InventoryGrid.svelte      # Main product grid
├── ProductCard.svelte        # Individual product display
├── SearchBar.svelte          # Search and filters
├── CartFloating.svelte       # Floating cart button
├── DiscountInput.svelte      # Dual discount system
└── cart/
    ├── CartView.svelte       # Cart interface
    ├── CartItem.svelte       # Cart item display
    └── CartFloatingButton.svelte
```

### Configuration
- PocketBase URL: api.acervocomum.com.br
- Theme: tropical-light (DaisyUI custom theme)
- Package manager: pnpm only
- Image processing via Sharp in root scripts