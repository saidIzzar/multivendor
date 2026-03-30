# MultiVendors - Moroccan E-Commerce Platform

A multivendor e-commerce platform built with React, TypeScript, Vite, and Tailwind CSS. Supports Arabic (RTL) and English languages.

## Features

- **Multi-vendor marketplace** - Multiple vendors can sell products
- **Role-based access** - Admin, Vendor, and Customer roles
- **Product approval system** - Vendors submit products, admins approve
- **Shopping cart** - Add, remove, update quantities
- **Checkout with validation** - React Hook Form + Zod validation
- **Cash on Delivery** - Payment on delivery
- **Moroccan cities shipping** - 20 cities with coordinates and shipping costs
- **Bilingual** - Arabic (RTL) and English support
- **Responsive design** - Mobile-first with Tailwind CSS v4

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **i18n**: i18next + react-i18next
- **Auth**: Supabase (placeholder config)
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── stores/         # Zustand state stores
├── types/          # TypeScript type definitions
├── i18n/           # Internationalization config
├── lib/            # Utilities and sample data
└── services/       # API/Services (Supabase)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Pages

- `/` - Home page with featured products
- `/products` - Product listing with filters
- `/cart` - Shopping cart
- `/checkout` - Checkout form with validation
- `/login` - Login/Register
- `/vendor` - Vendor dashboard (requires vendor role)
- `/admin` - Admin dashboard (requires admin role)
- `/faq` - Frequently asked questions

## Moroccan Cities Supported

The platform supports 20 Moroccan cities with coordinates for map integration:
Casablanca, Rabat, Marrakech, Fes, Tangier, Agadir, Meknes, Oujda, Kenitra, Tetouan, Sale, Beni Mellal, Azrou, El Jadida, Essaouira, Ouarzazate, Chefchaouen, Ifrane, Nador, Dakhla

## License

MIT
