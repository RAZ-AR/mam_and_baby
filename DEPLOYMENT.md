# Deployment Guide

This guide covers deploying the Belgrade Mama Marketplace to production.

## Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Docker Deployment](#docker-deployment)
3. [Platform-Specific Guides](#platform-specific-guides)
4. [Pre-Deployment Checklist](#pre-deployment-checklist)
5. [Post-Deployment](#post-deployment)

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Railway (Backend)

**Best for**: Quick deployment, automatic scaling, minimal DevOps

**Frontend (Vercel)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from apps/web directory
cd apps/web
vercel

# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-api.railway.app
```

**Backend (Railway)**:
1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add PostgreSQL database
5. Set environment variables (see below)
6. Deploy

### Option 2: Docker Compose (VPS/Cloud)

**Best for**: Full control, cost-effective, single server deployment

See [Docker Deployment](#docker-deployment) section below.

### Option 3: Render (Full Stack)

**Best for**: Automatic deployments, managed services

1. Push to GitHub
2. Create Web Service for backend at [render.com](https://render.com)
3. Create Static Site for frontend
4. Add PostgreSQL database
5. Configure environment variables

---

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

### Step 1: Prepare Environment

Create `.env.prod` file in project root:

```bash
# Database
DB_USER=marketplace
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE
DB_NAME=marketplace

# API
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE
CORS_ORIGIN=https://yourdomain.com

# Web
VITE_API_URL=https://api.yourdomain.com
```

**Generate secure secrets:**
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 24
```

### Step 2: Build and Deploy

```bash
# Load environment variables
export $(cat .env.prod | xargs)

# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Step 3: Setup Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/belgrade-mama`:

```nginx
# API Backend
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and reload nginx:
```bash
sudo ln -s /etc/nginx/sites-available/belgrade-mama /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
sudo certbot renew --dry-run  # Test renewal
```

---

## Platform-Specific Guides

### Railway Deployment

**1. Backend API**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add PostgreSQL
railway add

# Set environment variables
railway variables set JWT_SECRET="your-secret"
railway variables set CORS_ORIGIN="https://your-frontend.vercel.app"

# Deploy
railway up
```

**2. Database Migrations**

```bash
# Connect to Railway
railway run bash

# Run migrations
npx prisma migrate deploy
```

### Vercel Deployment (Frontend)

**vercel.json**:
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

Deploy:
```bash
cd apps/web
vercel --prod
```

### Render Deployment

**Backend (Web Service)**:
- Build Command: `cd apps/api && pnpm install && pnpm build`
- Start Command: `cd apps/api && pnpm start:prod`
- Environment: Node

**Frontend (Static Site)**:
- Build Command: `cd apps/web && pnpm install && pnpm build`
- Publish Directory: `apps/web/dist`

---

## Pre-Deployment Checklist

### Security

- [ ] Change all default passwords
- [ ] Generate strong JWT secret (min 32 characters)
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS to specific domain
- [ ] Review and adjust rate limits
- [ ] Enable database SSL connection
- [ ] Set up database backups
- [ ] Add security headers (already configured)

### Environment Variables

**Backend (.env)**:
```bash
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
JWT_SECRET=your-secure-secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

**Frontend (.env)**:
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

### Database

- [ ] Database created and accessible
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma Client: `npx prisma generate`
- [ ] Set up automated backups
- [ ] Enable connection pooling
- [ ] Configure SSL connection

### Build

- [ ] Test production build locally:
  ```bash
  pnpm build
  cd apps/api && pnpm start:prod
  cd apps/web && pnpm preview
  ```
- [ ] Check for TypeScript errors: `pnpm typecheck`
- [ ] Review bundle size
- [ ] Test all features
- [ ] Check mobile responsiveness

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Configure alerts
- [ ] Set up performance monitoring

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check API health
curl https://api.yourdomain.com/

# Check frontend
curl https://yourdomain.com/

# Test authentication
curl -X POST https://api.yourdomain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

### 2. Monitor Logs

**Docker:**
```bash
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web
```

**Railway:**
```bash
railway logs
```

### 3. Database Backup

**Automated backup script:**
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_URL="your-database-url"

pg_dump $DB_URL > $BACKUP_DIR/backup_$DATE.sql
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

Setup cron job:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

### 4. Monitoring Setup

**Health check endpoint** (already available):
```bash
curl https://api.yourdomain.com/
```

**Uptime monitoring** (Use services like):
- UptimeRobot (free)
- Pingdom
- StatusCake

### 5. Performance Optimization

- Set up CDN (Cloudflare, CloudFront)
- Enable Redis for caching (optional)
- Configure connection pooling
- Optimize database queries
- Enable gzip compression (already configured)

---

## Troubleshooting

### API not starting

```bash
# Check logs
docker logs belgrade-mama-api-prod

# Common issues:
# - Database connection failed: Check DATABASE_URL
# - Port already in use: Change PORT in .env
# - Migrations failed: Run manually with `npx prisma migrate deploy`
```

### Frontend not loading

```bash
# Check if API URL is correct
console.log(import.meta.env.VITE_API_URL)

# Rebuild with correct env:
VITE_API_URL=https://api.yourdomain.com pnpm build
```

### Database connection issues

```bash
# Test connection
psql $DATABASE_URL

# Check SSL requirement
DATABASE_URL="...?sslmode=require"
```

### CORS errors

```bash
# Update CORS_ORIGIN in API .env
CORS_ORIGIN=https://yourdomain.com

# Restart API
docker-compose restart api
```

---

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Nginx, HAProxy, or cloud LB
2. **Multiple API instances**: Docker Swarm or Kubernetes
3. **Database replication**: Primary-replica setup
4. **File storage**: Move to S3/Cloudinary
5. **Session storage**: Move to Redis

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database indexes
- Add database connection pooling
- Use read replicas for heavy queries

---

## Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Test locally with production build
4. Open GitHub issue with details

## Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)
