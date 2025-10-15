# Belgrade Mama Marketplace

A multilingual marketplace application for buying and selling children's items in Belgrade. Built with React, Node.js, PostgreSQL, and TypeScript.

## 🚀 Quick Deploy (100% FREE!)

### 👉 **[START HERE - Начните с этого файла!](START_HERE.md)** 👈

**Ready to deploy in 15 minutes?**

**Рекомендуемый вариант: Render + Neon**
- 📖 **[Подробная инструкция](RENDER_NEON_DEPLOY.md)** - Пошаговый гайд
- ⏱️ 15 минут
- 💰 Бесплатно навсегда
- 💳 Кредитная карта НЕ нужна
- 💾 10GB база данных

**Другие варианты:**
- 🆓 **[FREE Hosting Guide](FREE_HOSTING.md)** - Все бесплатные варианты (Vercel, Supabase, Netlify)
- 📘 **[Quick Deploy Guide](QUICK_DEPLOY.md)** - Railway + Vercel
- 🔗 **[LINKS.md](LINKS.md)** - Все ссылки в одном месте

**GitHub Repository**: https://github.com/RAZ-AR/mam_and_baby

## Features

✅ **User Authentication** - Register, login, JWT-based authentication + OAuth (Google, Facebook)
✅ **Product Listings** - Create, browse, and search listings with photos
✅ **ISO Requests** - "In Search Of" requests with expiration tracking
✅ **Advanced Search** - Filter by price, location, age, size, and keywords
✅ **Photo Upload** - Multiple photo uploads (up to 5 per listing)
✅ **User Profiles** - View and manage your listings and ISO requests
✅ **Orders & Payments** - Complete order management with payment tracking and card number storage
✅ **Multilingual** - Full support for Serbian (Latin), Russian, and English
✅ **Modern UI** - Beautiful gradient design with smooth animations
✅ **Responsive Design** - Mobile-friendly interface

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router v6
- Zustand (state management)
- i18next (internationalization)
- Tailwind CSS
- Axios

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Cloudinary (image storage & CDN)
- Multer + multer-storage-cloudinary (file uploads)
- Zod (validation)

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

## Quick Start

### 1. Install Dependencies

```bash
# Install pnpm if needed
npm i -g pnpm

# Install all dependencies
pnpm install
```

### 2. Setup Environment Variables

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Edit apps/api/.env and update:
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET (generate with: openssl rand -base64 32)
```

### 3. Setup Database

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations
cd apps/api
npx prisma migrate dev
npx prisma generate
```

#### Option B: Local PostgreSQL
```bash
# Create database
psql -U postgres
CREATE DATABASE marketplace;
CREATE USER marketplace WITH PASSWORD 'marketplace';
GRANT ALL PRIVILEGES ON DATABASE marketplace TO marketplace;

# Run migrations
cd apps/api
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Servers

```bash
# Terminal 1: Start API
pnpm dev:api

# Terminal 2: Start Web App
pnpm dev:web
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## Project Structure

```
belgrade-mama-marketplace/
├── apps/
│   ├── api/              # Backend Express API
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── lib/      # Utilities (auth, prisma)
│   │   │   ├── middleware/ # Auth middleware
│   │   │   └── index.ts  # Server entry
│   │   ├── prisma/       # Database schema & migrations
│   │   ├── uploads/      # Uploaded files
│   │   └── .env          # Environment variables
│   │
│   └── web/              # Frontend React app
│       ├── src/
│       │   ├── pages/    # Page components
│       │   ├── lib/      # API client
│       │   ├── store/    # Zustand stores
│       │   ├── i18n/     # Translations
│       │   └── main.tsx  # App entry
│       └── .env          # Environment variables
│
├── packages/
│   └── ui/               # Shared UI components
│
├── docker-compose.yml    # PostgreSQL setup
└── package.json          # Monorepo root
```

## Available Scripts

```bash
# Development
pnpm dev:api          # Start backend API
pnpm dev:web          # Start frontend app

# Build
pnpm build            # Build all packages
pnpm build:api        # Build backend only
pnpm build:web        # Build frontend only

# Database
pnpm prisma:studio    # Open Prisma Studio
pnpm prisma:migrate   # Run migrations
pnpm prisma:generate  # Generate Prisma client

# Testing
cd apps/api && pnpm test           # Run backend tests
cd apps/web && pnpm test           # Run frontend tests
cd apps/api && pnpm test:coverage  # Backend coverage
cd apps/web && pnpm test:coverage  # Frontend coverage
pnpm lint                          # Lint all packages
```

## Environment Variables

### Backend (`apps/api/.env`)

```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace"
JWT_SECRET="your-secret-key-here"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Frontend (`apps/web/.env`)

```env
VITE_API_URL=http://localhost:4000
VITE_ENV=development
```

## API Documentation

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Listings
- `GET /listings` - Get all listings (with filters)
- `GET /listings/:id` - Get single listing
- `GET /listings/user/me` - Get user's listings
- `POST /listings` - Create listing

### ISO Requests
- `GET /iso/feed` - Get active ISOs
- `GET /iso/user/me` - Get user's ISOs
- `POST /iso` - Create ISO request

### Uploads
- `POST /upload` - Upload single image
- `POST /upload/listing/:id` - Upload listing photos

### Orders
- `GET /orders/my-purchases` - Get user's purchases
- `GET /orders/my-sales` - Get user's sales
- `GET /orders/:id` - Get single order
- `POST /orders` - Create new order
- `PATCH /orders/:id/status` - Update order status

## Deployment

### 🚀 Recommended Stack (100% FREE!)
- **Backend**: Render Free Tier
- **Frontend**: Render Static Site
- **Database**: Neon PostgreSQL (10GB free)
- **Image Storage**: Cloudinary (25GB free)

📖 **[Complete Deployment Guide](RENDER_NEON_DEPLOY.md)** - Step-by-step instructions

### Backend (Render)
- Requires: PostgreSQL database, Node.js runtime, Cloudinary account
- Build Command: `cd apps/api && npm install --legacy-peer-deps && npx prisma generate`
- Start Command: `cd apps/api && npx prisma db push --accept-data-loss && npx tsx src/index.ts`

### Frontend (Render Static Site)
- Build Command: `cd apps/web && pnpm vite build`
- Publish Directory: `apps/web/dist`

## Security Considerations

⚠️ **Before deploying to production:**

1. Generate a strong JWT secret: `openssl rand -base64 32`
2. Use secure PostgreSQL credentials (use Neon for free)
3. Setup Cloudinary account for image storage
4. Enable HTTPS (automatic on Render)
5. Set `NODE_ENV=production`
6. Review CORS settings
7. Configure rate limiting
8. Enable security headers
9. **Important**: Render Free Tier has cold starts after 15 min inactivity
   - Use UptimeRobot (free) to keep your backend awake

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

MIT

## Support

For questions or issues, please open a GitHub issue.
