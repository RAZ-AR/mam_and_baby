# Belgrade Mama Marketplace - Backend API

Node.js/Express backend API for the Belgrade Mama marketplace application.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- pnpm (recommended) or npm

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

### Required Variables

- `PORT` - Server port (default: 4000)
- `CORS_ORIGIN` - Frontend URL for CORS (default: http://localhost:5173)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (**MUST change in production!**)

### Optional Variables

- `NODE_ENV` - Environment (development/production)
- `MAX_FILE_SIZE` - Maximum upload file size in bytes (default: 5MB)
- `MAX_FILES` - Maximum number of files per upload (default: 5)

## Database Setup

### Option 1: Docker (Recommended for Development)

```bash
# Start PostgreSQL with docker-compose
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Seed database (if applicable)
npx prisma db seed
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```sql
CREATE DATABASE marketplace;
CREATE USER marketplace WITH PASSWORD 'marketplace';
GRANT ALL PRIVILEGES ON DATABASE marketplace TO marketplace;
```

3. Update `DATABASE_URL` in `.env`
4. Run migrations:
```bash
npx prisma migrate dev
```

## Development

```bash
# Install dependencies
pnpm install

# Generate Prisma client
npx prisma generate

# Run development server
pnpm dev
```

The API will be available at `http://localhost:4000`

## Production

```bash
# Build
pnpm build

# Run migrations
npx prisma migrate deploy

# Start server
pnpm start
```

## API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user (requires auth)

### Listing Endpoints

- `GET /listings` - Get all listings (supports filters)
- `GET /listings/:id` - Get single listing
- `GET /listings/user/me` - Get current user's listings (requires auth)
- `POST /listings` - Create listing (requires auth)

### ISO (In Search Of) Endpoints

- `GET /iso/feed` - Get active ISO requests
- `GET /iso/user/me` - Get current user's ISOs (requires auth)
- `POST /iso` - Create ISO request (requires auth)

### Upload Endpoints

- `POST /upload` - Upload single image (requires auth)
- `POST /upload/listing/:id` - Upload listing photos (requires auth)

## Security Notes

⚠️ **IMPORTANT for Production:**

1. Change `JWT_SECRET` to a strong random value:
   ```bash
   openssl rand -base64 32
   ```

2. Use environment-specific database credentials

3. Enable HTTPS in production

4. Set `NODE_ENV=production`

5. Review and update CORS settings

## File Storage

Currently uses local file storage in `uploads/` directory. For production, consider:
- AWS S3
- Cloudinary
- Digital Ocean Spaces
- Any S3-compatible service
