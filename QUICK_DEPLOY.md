# 🚀 Quick Deploy Guide

Самый быстрый способ развернуть Belgrade Mama Marketplace онлайн!

## ✅ Что уже сделано

- ✅ Код загружен на GitHub: https://github.com/RAZ-AR/mam_and_baby
- ✅ Созданы конфигурационные файлы для хостинга
- ✅ GitHub Desktop настроен для работы с репозиторием

## 📋 Пошаговая инструкция

### Шаг 1: Деплой Backend на Railway (5 минут)

1. **Перейдите на Railway.app**
   - Откройте: https://railway.app
   - Нажмите "Login" → "Login with GitHub"

2. **Создайте новый проект**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Найдите и выберите: `RAZ-AR/mam_and_baby`

3. **Добавьте PostgreSQL базу данных**
   - Нажмите "+ New" → "Database" → "PostgreSQL"
   - Railway автоматически создаст базу данных

4. **Настройте переменные окружения**
   - Перейдите в сервис API → Variables
   - Добавьте следующие переменные:
   ```
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
   NODE_ENV=production
   PORT=4000
   FRONTEND_URL=https://your-app.vercel.app
   ```
   - `DATABASE_URL` уже добавлен автоматически

5. **Настройте команды деплоя**
   - Settings → Deploy
   - Build Command: `cd apps/api && pnpm install && pnpm prisma generate`
   - Start Command: `cd apps/api && pnpm prisma migrate deploy && pnpm start`

6. **Деплой!**
   - Нажмите "Deploy"
   - Скопируйте URL вашего API (например: `https://your-app.up.railway.app`)

### Шаг 2: Деплой Frontend на Vercel (3 минуты)

1. **Перейдите на Vercel.com**
   - Откройте: https://vercel.com
   - Нажмите "Sign Up" → "Continue with GitHub"

2. **Импортируйте проект**
   - Нажмите "Add New..." → "Project"
   - Найдите репозиторий: `RAZ-AR/mam_and_baby`
   - Нажмите "Import"

3. **Настройте проект**
   - Framework Preset: **Vite**
   - Root Directory: Оставьте пустым (автоопределение)
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Output Directory: `apps/web/dist`
   - Install Command: `pnpm install`

4. **Добавьте переменную окружения**
   - Environment Variables:
   ```
   VITE_API_URL = https://your-railway-app.up.railway.app
   ```
   (Вставьте URL вашего Railway API из Шага 1)

5. **Деплой!**
   - Нажмите "Deploy"
   - Дождитесь завершения (1-2 минуты)
   - Скопируйте URL вашего сайта (например: `https://belgrade-mama.vercel.app`)

### Шаг 3: Финальная настройка (2 минуты)

1. **Обновите FRONTEND_URL в Railway**
   - Вернитесь в Railway → Variables
   - Обновите `FRONTEND_URL` на URL вашего Vercel сайта
   - Railway автоматически передеплоит

2. **Готово! 🎉**
   - Откройте ваш сайт на Vercel URL
   - Протестируйте регистрацию и логин
   - Попробуйте создать объявление

## 🔧 Настройка OAuth (опционально)

Если хотите включить логин через Google и Facebook:

### Google OAuth

1. Перейдите: https://console.cloud.google.com/apis/credentials
2. Create Credentials → OAuth client ID → Web application
3. Authorized redirect URIs: `https://your-railway-app.up.railway.app/auth/google/callback`
4. Скопируйте Client ID и Client Secret
5. Добавьте в Railway Variables:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### Facebook OAuth

1. Перейдите: https://developers.facebook.com/apps/
2. Create App → Consumer → Add Facebook Login
3. Settings → Basic: скопируйте App ID и App Secret
4. Facebook Login → Settings → Valid OAuth Redirect URIs:
   `https://your-railway-app.up.railway.app/auth/facebook/callback`
5. Добавьте в Railway Variables:
   ```
   FACEBOOK_APP_ID=your-app-id
   FACEBOOK_APP_SECRET=your-app-secret
   ```

## 📊 Мониторинг

### Railway
- Dashboard: https://railway.app/dashboard
- Логи: Project → Deployments → View Logs
- Database: Project → PostgreSQL → Data

### Vercel
- Dashboard: https://vercel.com/dashboard
- Deployments: Project → Deployments
- Logs: Deployment → Function Logs

## 🆘 Troubleshooting

### Frontend не загружается
- Проверьте Vercel Deployment Logs
- Убедитесь что build завершился успешно
- Проверьте что `VITE_API_URL` правильно настроен

### Backend не отвечает
- Проверьте Railway Logs
- Убедитесь что все переменные окружения настроены
- Проверьте что миграции БД выполнились: `pnpm prisma migrate deploy`

### База данных не подключается
- Railway автоматически настраивает `DATABASE_URL`
- Проверьте что PostgreSQL сервис запущен
- Попробуйте перезапустить API сервис

### OAuth не работает
- Убедитесь что redirect URIs совпадают
- Проверьте что OAuth credentials добавлены в Railway
- Проверьте что `BACKEND_URL` правильный

## 💰 Стоимость

**Бесплатно!** Оба сервиса предоставляют щедрый free tier:

- **Railway**: $5 кредитов в месяц (хватит на ~500 часов)
- **Vercel**: Unlimited deployments, 100GB bandwidth

## 📝 Обновление приложения

### Через GitHub Desktop (рекомендуется)
1. Внесите изменения в код
2. Откройте GitHub Desktop
3. Напишите описание изменений
4. Нажмите "Commit to main"
5. Нажмите "Push origin"
6. Railway и Vercel автоматически задеплоят новую версию!

### Через командную строку
```bash
git add .
git commit -m "Ваше описание изменений"
git push
```

## 🎯 Следующие шаги

- Добавьте свой домен в Vercel (Settings → Domains)
- Настройте SSL сертификат (автоматически на Vercel)
- Добавьте Google Analytics
- Настройте email уведомления
- Добавьте больше функционала!

## 📚 Дополнительная информация

Подробная документация: `HOSTING.md`

---

**Нужна помощь?** Откройте issue на GitHub: https://github.com/RAZ-AR/mam_and_baby/issues
