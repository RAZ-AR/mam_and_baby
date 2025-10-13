# Belgrade Mama Marketplace - Frontend

React + Vite frontend application for the Belgrade Mama marketplace.

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

### Required Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:4000)

### Optional Variables

- `VITE_ENV` - Environment (development/production)

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The app will be available at `http://localhost:5173`

## Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Features

- **Multilingual Support**: Serbian (Latin), Russian, English
- **User Authentication**: Register, login, profile management
- **Listings**: Create, browse, search, and filter product listings
- **ISO Requests**: Create "In Search Of" requests with expiration
- **Photo Upload**: Multiple photo uploads per listing
- **Responsive Design**: Mobile-friendly interface
- **Real-time Search**: Instant search and filtering

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **i18next** - Internationalization
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── ListingCreate.tsx
│   ├── ListingDetail.tsx
│   └── ISOCreate.tsx
├── lib/             # Utilities and API client
│   └── api.ts
├── store/           # Zustand stores
│   └── authStore.ts
├── i18n/            # Internationalization
│   ├── setup.ts
│   └── locales/
└── main.tsx         # Entry point
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `VITE_API_URL`: Your production API URL
4. Deploy

### Netlify

1. Build command: `pnpm build`
2. Publish directory: `dist`
3. Set environment variables in Netlify dashboard

### Other Static Hosts

Build the project and upload the `dist` folder to any static hosting service.

## Environment Variables in Production

Make sure to set `VITE_API_URL` to point to your production backend API URL.

Example:
```
VITE_API_URL=https://api.yourdomain.com
```
