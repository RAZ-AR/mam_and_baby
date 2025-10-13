# 🔗 Quick Links - Belgrade Mama Marketplace

## 📦 GitHub Repository
**Main Repository**: https://github.com/RAZ-AR/mam_and_baby

## 🆓 100% Бесплатный Хостинг (БЕЗ КАРТЫ!)

### Вариант 1: Vercel + Supabase (Рекомендую!)
- **Frontend**: https://vercel.com (100GB bandwidth бесплатно)
- **Backend**: https://vercel.com (serverless functions)
- **Database**: https://supabase.com (500MB PostgreSQL бесплатно)

### Вариант 2: Render + Neon
- **Frontend + Backend**: https://render.com (750 часов/месяц бесплатно)
- **Database**: https://neon.tech (10GB PostgreSQL бесплатно)

### Вариант 3: Netlify + PlanetScale
- **Frontend**: https://netlify.com (100GB bandwidth бесплатно)
- **Database**: https://planetscale.com (5GB MySQL бесплатно)

📖 **Подробные инструкции**: [FREE_HOSTING.md](FREE_HOSTING.md)

---

## 🚀 Deploy Your App (Другие опции)

### Step 1: Backend on Railway
1. **Railway Dashboard**: https://railway.app
2. **Create Project**: https://railway.app/new
3. **Add PostgreSQL**: Click "+ New" → "Database" → "PostgreSQL"
4. **Deploy from GitHub**: Select `RAZ-AR/mam_and_baby`

### Step 2: Frontend on Vercel
1. **Vercel Dashboard**: https://vercel.com
2. **New Project**: https://vercel.com/new
3. **Import from GitHub**: Select `RAZ-AR/mam_and_baby`

## 📚 Documentation Files

- 📘 [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - 10-minute deployment guide
- 📗 [HOSTING.md](HOSTING.md) - Detailed hosting options
- 📕 [OAUTH_SETUP.md](OAUTH_SETUP.md) - Google & Facebook OAuth setup
- 📙 [README.md](README.md) - Main documentation
- 📝 [ORDERS.md](ORDERS.md) - Order system documentation
- 🔒 [SECURITY.md](SECURITY.md) - Security best practices
- 🧪 [TESTING.md](TESTING.md) - Testing guide

## 🔧 OAuth Provider Setup (Optional)

### Google OAuth
- **Console**: https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client ID
- Add redirect URI: `https://your-railway-app.up.railway.app/auth/google/callback`

### Facebook OAuth
- **Console**: https://developers.facebook.com/apps/
- Create App → Add Facebook Login
- Add redirect URI: `https://your-railway-app.up.railway.app/auth/facebook/callback`

## 📊 Monitoring & Management

### Railway (Backend)
- Dashboard: https://railway.app/dashboard
- View logs, manage environment variables, monitor usage

### Vercel (Frontend)
- Dashboard: https://vercel.com/dashboard
- View deployments, check analytics, configure domains

## 🛠️ Development Tools

### Local Development
```bash
# Start backend
pnpm dev:api

# Start frontend
pnpm dev:web
```

### GitHub Desktop
- Open with: `File → Add Local Repository`
- Select: `/Users/bari/Documents/GitHub/belgrade-mama-marketplace`

## 🌐 After Deployment

Once deployed, your app will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app`

## 📝 Next Steps

1. ✅ Code is on GitHub: https://github.com/RAZ-AR/mam_and_baby
2. ⬜ Deploy backend to Railway (5 minutes)
3. ⬜ Deploy frontend to Vercel (3 minutes)
4. ⬜ Test the live app
5. ⬜ (Optional) Setup OAuth
6. ⬜ Share with users!

## 💡 Tips

- **GitHub Desktop**: Use for easy commits and pushes
- **Free Tiers**: Both Railway and Vercel offer generous free plans
- **Auto-Deploy**: Every `git push` automatically deploys to production
- **Custom Domain**: Add your own domain in Vercel settings (free HTTPS)

## 🆘 Need Help?

- Open an issue: https://github.com/RAZ-AR/mam_and_baby/issues
- Check logs in Railway/Vercel dashboards
- Review [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for troubleshooting

---

**Happy Deploying! 🚀**
