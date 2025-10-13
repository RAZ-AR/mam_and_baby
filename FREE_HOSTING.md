# 🆓 100% Бесплатный Хостинг - Belgrade Mama Marketplace

Полностью бесплатные решения для вашего приложения (без кредитной карты!)

## 🎯 Лучшие Бесплатные Варианты

### Вариант 1: Vercel + Supabase (Рекомендую!)

**✅ Почему этот вариант:**
- Полностью бесплатно навсегда
- Не нужна кредитная карта
- Автоматический деплой
- Встроенная PostgreSQL база
- SSL сертификаты

---

## 🚀 Быстрый Старт (15 минут)

### Шаг 1: Supabase (База данных + Backend) - 5 минут

1. **Создайте аккаунт на Supabase**
   - Откройте: https://supabase.com
   - Sign up with GitHub (бесплатно, карта не нужна)

2. **Создайте новый проект**
   - New Project
   - Название: `belgrade-mama`
   - Database Password: придумайте надежный пароль
   - Region: Europe (ближе к Белграду)
   - Бесплатный план выбран автоматически

3. **Получите DATABASE_URL**
   - Project Settings → Database
   - Connection string → URI
   - Скопируйте строку подключения (начинается с `postgresql://`)

4. **Разверните Backend на Vercel**
   - Перейдите на: https://vercel.com
   - Sign up with GitHub
   - New Project → Import `RAZ-AR/mam_and_baby`

5. **Настройте Backend на Vercel**
   - Framework Preset: **Other**
   - Root Directory: `apps/api`
   - Build Command: `pnpm install && pnpm prisma generate && pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

6. **Добавьте переменные окружения в Vercel:**
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   NODE_ENV=production
   PORT=4000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

7. **Deploy Backend**
   - Нажмите Deploy
   - Подождите 2-3 минуты
   - Скопируйте URL (например: `https://belgrade-mama-api.vercel.app`)

### Шаг 2: Vercel (Frontend) - 5 минут

1. **Создайте еще один проект на Vercel**
   - New Project → Import `RAZ-AR/mam_and_baby`

2. **Настройте Frontend**
   - Framework Preset: **Vite**
   - Root Directory: `apps/web`
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Output Directory: `apps/web/dist`
   - Install Command: `pnpm install`

3. **Добавьте переменную окружения:**
   ```
   VITE_API_URL=https://your-backend.vercel.app
   ```
   (URL вашего backend из Шага 1)

4. **Deploy Frontend**
   - Нажмите Deploy
   - Подождите 1-2 минуты
   - Скопируйте URL (например: `https://belgrade-mama.vercel.app`)

### Шаг 3: Миграция базы данных - 2 минуты

1. **Вернитесь в Backend проект на Vercel**
   - Settings → Functions
   - Add one-time command:
   ```bash
   cd apps/api && pnpm prisma migrate deploy
   ```

2. **Запустите миграцию**
   - Или запустите локально:
   ```bash
   DATABASE_URL="your-supabase-url" pnpm --filter @app/api prisma migrate deploy
   ```

### Шаг 4: Обновите FRONTEND_URL - 1 минута

1. **Backend проект на Vercel**
   - Settings → Environment Variables
   - Обновите `FRONTEND_URL` на URL вашего frontend
   - Redeploy

---

## 🎁 Бесплатные лимиты

### Supabase (Free Plan)
- ✅ 500MB база данных
- ✅ 2GB файлового хранилища
- ✅ 50GB трафика в месяц
- ✅ Автоматические бэкапы (7 дней)
- ✅ Без кредитной карты

### Vercel (Hobby Plan - Free)
- ✅ Unlimited сайтов
- ✅ 100GB bandwidth в месяц
- ✅ Автоматический SSL
- ✅ Git интеграция
- ✅ Без кредитной карты

---

## Вариант 2: Render + Neon (Альтернатива)

### Neon (PostgreSQL) - Бесплатно
1. Откройте: https://neon.tech
2. Sign up with GitHub
3. Create Project → Выберите регион Europe
4. Скопируйте Connection String

**Бесплатные лимиты:**
- ✅ 1 проект
- ✅ 10GB хранилища
- ✅ Автоматическое масштабирование
- ✅ Без кредитной карты

### Render (Backend + Frontend)
1. Откройте: https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect `RAZ-AR/mam_and_baby`
5. Настройте переменные окружения

**Бесплатные лимиты:**
- ✅ 750 часов в месяц
- ✅ Спит после 15 минут неактивности (холодный старт ~30 сек)
- ✅ 512MB RAM
- ✅ Без кредитной карты

---

## Вариант 3: Netlify + PlanetScale

### PlanetScale (MySQL Database)
1. Откройте: https://planetscale.com
2. Sign up with GitHub
3. Create database → Free tier
4. Get connection string

**Бесплатные лимиты:**
- ✅ 1 база данных
- ✅ 5GB хранилища
- ✅ 1 миллиард row reads в месяц
- ✅ Без кредитной карты

**⚠️ Внимание:** Потребуется адаптировать Prisma schema для MySQL

### Netlify (Frontend)
1. Откройте: https://netlify.com
2. Import from GitHub
3. Deploy

**Бесплатные лимиты:**
- ✅ 100GB bandwidth
- ✅ 300 минут build времени
- ✅ Автоматический SSL

---

## 🏆 Моя рекомендация

**Для начала: Vercel + Supabase**

✅ **Преимущества:**
- Проще всего настроить
- Самые щедрые бесплатные лимиты
- Отличная производительность
- PostgreSQL (как в dev окружении)
- Нет холодных стартов

**Для масштабирования позже:**
- Frontend на Vercel (остается бесплатным)
- Backend на Railway ($5/месяц) или VPS
- Database на Supabase (увеличить план)

---

## 📊 Сравнение бесплатных планов

| Сервис | База данных | Bandwidth | RAM | Холодный старт | Карта нужна? |
|--------|-------------|-----------|-----|----------------|--------------|
| **Vercel + Supabase** | 500MB | 100GB | Serverless | Нет | ❌ Нет |
| **Render + Neon** | 10GB | Unlimited | 512MB | Да (~30 сек) | ❌ Нет |
| **Netlify + PlanetScale** | 5GB | 100GB | Serverless | Нет | ❌ Нет |
| Railway | 1GB | 100GB | 512MB | Нет | ⚠️ $5 кредит |

---

## 💡 Советы по экономии

1. **Используйте бесплатные CDN**
   - Cloudflare (бесплатный SSL, DDoS защита)
   - Cloudinary (бесплатное хранение изображений)

2. **Оптимизируйте запросы**
   - Кэшируйте данные на frontend
   - Используйте pagination
   - Минимизируйте API calls

3. **Мониторинг лимитов**
   - Следите за bandwidth в Vercel dashboard
   - Проверяйте размер БД в Supabase

4. **Автоматические бэкапы**
   - Supabase делает бэкапы автоматически
   - Дополнительно экспортируйте важные данные

---

## 🔧 Настройка для Vercel Backend

Так как Vercel оптимизирован для serverless, нужно немного адаптировать backend:

### Создайте `vercel.json` в корне apps/api:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

### Или используйте Vercel только для Frontend

А Backend разверните на:
- **Render** (бесплатно, но с холодным стартом)
- **Railway** ($5 кредитов в месяц)
- **Fly.io** (бесплатный tier)

---

## 🆘 Troubleshooting

### Vercel: Build timeout
- Увеличьте timeout в настройках проекта
- Или разделите backend и frontend на разные проекты

### Supabase: Connection limit
- Используйте connection pooling
- Vercel автоматически использует serverless connections

### Render: Cold starts
- Первый запрос после 15 минут займет ~30 секунд
- Используйте cron job для "подогрева" (https://cron-job.org)

---

## 🎯 Следующие шаги

1. ✅ Выберите вариант (рекомендую: Vercel + Supabase)
2. ⬜ Следуйте инструкциям выше
3. ⬜ Протестируйте приложение
4. ⬜ Настройте домен (опционально, бесплатно на Vercel)
5. ⬜ Добавьте OAuth (опционально)

---

**Нужна помощь?** Напишите в issues: https://github.com/RAZ-AR/mam_and_baby/issues

**Удачи! 🚀**
