# Hosting Guide - Belgrade Mama Marketplace

This guide explains how to deploy the Belgrade Mama marketplace to production using free hosting platforms.

## Architecture

- **Frontend**: Vercel (Free tier)
- **Backend API**: Railway or Render (Free tier)
- **Database**: PostgreSQL on Railway or Render (Free tier)

## Option 1: Vercel + Railway (Recommended)

### Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `RAZ-AR/mam_and_baby`
4. Railway will detect the Node.js project automatically

5. Add a PostgreSQL database:
   - Click "+ New" → "Database" → "PostgreSQL"
   - Railway will create a database and provide DATABASE_URL

6. Set environment variables in Railway:
   ```
   DATABASE_URL=<provided by Railway>
   JWT_SECRET=<generate random 32+ character string>
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=<your vercel URL, e.g. https://belgrade-mama.vercel.app>
   BACKEND_URL=<your railway URL, e.g. https://your-app.up.railway.app>

   # OAuth (optional, set these if using OAuth)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   ```

7. Configure build settings:
   - Build Command: `cd apps/api && pnpm install && pnpm prisma generate`
   - Start Command: `cd apps/api && pnpm prisma migrate deploy && pnpm start`
   - Root Directory: `/`

8. Deploy! Railway will build and start your API

9. Run database migrations:
   - Go to your Railway project → Settings → Deploy
   - Add one-time command: `cd apps/api && pnpm prisma migrate deploy`

### Step 2: Deploy Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository: `RAZ-AR/mam_and_baby`

4. Configure build settings:
   - Framework Preset: **Vite**
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Output Directory: `apps/web/dist`
   - Install Command: `pnpm install`

5. Set environment variables:
   ```
   VITE_API_URL=<your railway backend URL>
   ```

6. Click "Deploy"

7. After deployment, copy your Vercel URL (e.g., `https://belgrade-mama.vercel.app`)

8. Go back to Railway and update the `FRONTEND_URL` environment variable with your Vercel URL

### Step 3: Update OAuth Redirect URIs

If using OAuth, update redirect URIs in Google/Facebook developer consoles:

**Google Cloud Console:**
- Authorized redirect URIs: `https://your-railway-url.up.railway.app/auth/google/callback`

**Facebook Developers:**
- Valid OAuth Redirect URIs: `https://your-railway-url.up.railway.app/auth/facebook/callback`

## Option 2: Render (All-in-One)

### Deploy to Render

1. Go to [Render.com](https://render.com) and sign in with GitHub
2. Click "New +" → "Blueprint"
3. Connect your repository: `RAZ-AR/mam_and_baby`
4. Render will detect `render.yaml` and create services automatically

5. Set environment variables for the API service:
   - `DATABASE_URL`: Provided by Render PostgreSQL
   - `JWT_SECRET`: Generate a strong random string
   - `FRONTEND_URL`: Your Render static site URL
   - OAuth credentials (if using)

6. For frontend, create a new "Static Site":
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Publish Directory: `apps/web/dist`
   - Environment Variable: `VITE_API_URL=<your-render-api-url>`

## Option 3: Docker + Any VPS

If you have a VPS (DigitalOcean, Linode, AWS EC2, etc.):

```bash
# Clone repository
git clone https://github.com/RAZ-AR/mam_and_baby.git
cd mam_and_baby

# Copy and configure environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Edit .env files with production values

# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec api pnpm prisma migrate deploy
```

Your app will be available at:
- Frontend: `http://your-server-ip:5173`
- Backend: `http://your-server-ip:4000`

For production, set up Nginx reverse proxy with SSL certificates.

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Backend API is accessible
- [ ] Database connection works
- [ ] User registration/login works
- [ ] OAuth login works (if configured)
- [ ] File uploads work
- [ ] Create listing functionality works
- [ ] Orders can be placed
- [ ] Check browser console for errors
- [ ] Test on mobile devices

## Monitoring

### Railway
- Check logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel
- Check deployment logs
- Monitor function execution
- Set up analytics

## Troubleshooting

### Backend not connecting to database
- Check `DATABASE_URL` is correct
- Verify database migrations ran: `pnpm prisma migrate deploy`
- Check Railway/Render logs for connection errors

### Frontend can't reach backend
- Verify `VITE_API_URL` points to correct backend URL
- Check CORS settings in backend
- Ensure backend is running

### OAuth not working
- Update redirect URIs in Google/Facebook consoles
- Verify OAuth credentials in environment variables
- Check `BACKEND_URL` and `FRONTEND_URL` match production URLs

## Costs

### Free Tier Limits

**Railway (Free Plan):**
- $5 of credit per month
- Enough for ~500 hours of runtime
- 1GB RAM, 1GB storage

**Vercel (Hobby Plan - Free):**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for personal projects

**Render (Free Plan):**
- Spins down after 15 minutes of inactivity
- 750 hours/month runtime
- 512MB RAM

## Upgrading

When you outgrow free tiers:

- **Railway**: $5/month for 500 hours + $0.000463/GB-hour RAM
- **Vercel Pro**: $20/month for more bandwidth and features
- **Render**: $7/month for always-on services

## Support

For issues:
1. Check service status pages
2. Review deployment logs
3. Verify environment variables
4. Test locally with production config

For help with specific platforms:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs
