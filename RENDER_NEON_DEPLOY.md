# 🚀 Деплой на Render + Neon (100% Бесплатно)

Пошаговая инструкция для развертывания Belgrade Mama Marketplace на Render + Neon БЕЗ кредитной карты!

## ✨ Что получите

- ✅ **10GB PostgreSQL база** (Neon)
- ✅ **750 часов хостинга** в месяц (Render)
- ✅ **Автоматический SSL**
- ✅ **Git интеграция**
- ✅ **Без кредитной карты**
- ⚠️ Холодный старт ~30 секунд после 15 минут неактивности

---

## 🎯 Шаг 1: Neon (База данных) - 3 минуты

### 1.1 Создайте аккаунт

1. Откройте: https://console.neon.tech/signup
2. **Sign up with GitHub** (бесплатно, карта НЕ нужна)
3. Подтвердите email если попросит

### 1.2 Создайте проект

1. После входа нажмите **"Create a project"**
2. **Project name**: `belgrade-mama`
3. **Database name**: `marketplace`
4. **Region**: выберите **Europe (Frankfurt)** или ближайший к Белграду
5. **Compute size**: оставьте по умолчанию
6. Нажмите **"Create project"**

### 1.3 Получите connection string

1. После создания вы увидите экран с connection string
2. Нажмите на строку подключения чтобы скопировать
3. Она выглядит так:
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/marketplace?sslmode=require
   ```
4. **СОХРАНИТЕ ЭТУ СТРОКУ** - она понадобится на следующем шаге

**💡 Совет:** Если случайно закрыли, найдите строку в: Dashboard → Connection Details → Connection string

---

## 🎯 Шаг 2: Render (Backend API) - 7 минут

### 2.1 Создайте аккаунт

1. Откройте: https://dashboard.render.com/register
2. **Sign up with GitHub** (бесплатно, карта НЕ нужна)
3. Авторизуйте доступ к GitHub

### 2.2 Создайте Web Service для Backend

1. На Render Dashboard нажмите **"New +"** → **"Web Service"**
2. Нажмите **"Build and deploy from a Git repository"** → **"Next"**
3. **Connect your GitHub account** если еще не подключен
4. Найдите и выберите репозиторий: **`RAZ-AR/mam_and_baby`**
5. Нажмите **"Connect"**

### 2.3 Настройте Backend Service

Заполните следующие поля:

**Basic Settings:**
- **Name**: `belgrade-mama-api` (или любое другое имя)
- **Region**: Europe (Франкфурт) - ближе к вашим пользователям
- **Branch**: `main`
- **Root Directory**: `apps/api`
- **Runtime**: `Node`

**Build Settings:**
- **Build Command**:
  ```bash
  pnpm install && pnpm prisma generate
  ```

- **Start Command**:
  ```bash
  pnpm prisma migrate deploy && pnpm start
  ```

**Instance Type:**
- Выберите: **Free** (должно быть выбрано по умолчанию)

### 2.4 Добавьте Environment Variables

Прокрутите вниз до секции **"Environment Variables"** и добавьте:

1. **DATABASE_URL**
   - Value: `ваша строка подключения из Neon` (из Шага 1.3)

2. **JWT_SECRET**
   - Value: `your-super-secret-jwt-key-at-least-32-characters-long`
   - (Или сгенерируйте: `openssl rand -base64 32`)

3. **NODE_ENV**
   - Value: `production`

4. **PORT**
   - Value: `4000`

5. **FRONTEND_URL**
   - Value: `https://belgrade-mama-web.onrender.com`
   - (Измените `belgrade-mama-web` на имя которое выберете для frontend)

6. **BACKEND_URL**
   - Value: `https://belgrade-mama-api.onrender.com`
   - (Ваш URL будет показан после деплоя)

**Опционально (для OAuth):**

7. **GOOGLE_CLIENT_ID** (если используете Google OAuth)
   - Value: `your-google-client-id`

8. **GOOGLE_CLIENT_SECRET**
   - Value: `your-google-client-secret`

9. **FACEBOOK_APP_ID** (если используете Facebook OAuth)
   - Value: `your-facebook-app-id`

10. **FACEBOOK_APP_SECRET**
    - Value: `your-facebook-app-secret`

### 2.5 Деплой Backend

1. Прокрутите вниз и нажмите **"Create Web Service"**
2. Render начнет build и deploy (займет 3-5 минут)
3. Дождитесь статуса **"Live"** (зеленый индикатор)
4. **Скопируйте URL** вашего API (например: `https://belgrade-mama-api.onrender.com`)

**💡 Важно:** Сохраните этот URL - он понадобится для frontend!

---

## 🎯 Шаг 3: Render (Frontend) - 5 минут

### 3.1 Создайте Static Site для Frontend

1. На Render Dashboard нажмите **"New +"** → **"Static Site"**
2. Выберите тот же репозиторий: **`RAZ-AR/mam_and_baby`**
3. Нажмите **"Connect"**

### 3.2 Настройте Frontend Site

**Basic Settings:**
- **Name**: `belgrade-mama-web` (или любое другое)
- **Branch**: `main`
- **Root Directory**: `apps/web`

**Build Settings:**
- **Build Command**:
  ```bash
  pnpm install && pnpm build
  ```

- **Publish Directory**:
  ```
  dist
  ```

### 3.3 Добавьте Environment Variable

В секции **"Environment Variables"** добавьте:

1. **VITE_API_URL**
   - Value: `https://belgrade-mama-api.onrender.com`
   - (URL вашего backend API из Шага 2.5)

### 3.4 Деплой Frontend

1. Нажмите **"Create Static Site"**
2. Render начнет build (займет 2-3 минуты)
3. Дождитесь завершения деплоя
4. **Скопируйте URL** вашего сайта (например: `https://belgrade-mama-web.onrender.com`)

---

## 🎯 Шаг 4: Обновите FRONTEND_URL в Backend - 1 минута

1. Вернитесь в Render Dashboard
2. Откройте ваш **Backend service** (`belgrade-mama-api`)
3. Перейдите в **Environment** (слева в меню)
4. Найдите переменную **FRONTEND_URL**
5. Обновите значение на URL вашего frontend (из Шага 3.4)
   - Например: `https://belgrade-mama-web.onrender.com`
6. Нажмите **"Save Changes"**
7. Render автоматически передеплоит backend с новыми настройками

---

## 🎯 Шаг 5: Проверка работы - 2 минуты

### 5.1 Проверьте Backend

1. Откройте в браузере: `https://your-backend-url.onrender.com`
2. Вы должны увидеть: `Cannot GET /` или JSON с ошибкой
3. Это нормально! API работает

### 5.2 Проверьте Frontend

1. Откройте ваш frontend URL: `https://your-frontend-url.onrender.com`
2. Вы должны увидеть главную страницу Belgrade Mama
3. Попробуйте зарегистрироваться / войти
4. Создайте тестовое объявление

### 5.3 Если что-то не работает

**Проверьте логи Backend:**
1. Render Dashboard → Backend Service → Logs
2. Ищите ошибки (красный текст)

**Проверьте логи Frontend:**
1. Render Dashboard → Frontend Site → Logs
2. Проверьте build завершился успешно

**Типичные проблемы:**
- ❌ Backend не запускается → Проверьте DATABASE_URL правильный
- ❌ Frontend не видит Backend → Проверьте VITE_API_URL
- ❌ Ошибки миграции БД → Запустите миграции вручную (см. ниже)

---

## 🔧 Дополнительные настройки

### Запуск миграций вручную (если нужно)

Если миграции не запустились автоматически:

1. **Render Dashboard** → Backend Service → **Shell** (в меню слева)
2. В консоли выполните:
   ```bash
   cd apps/api
   pnpm prisma migrate deploy
   ```

### Настройка OAuth (опционально)

Если хотите включить Google/Facebook login:

1. **Google OAuth**: [OAUTH_SETUP.md](OAUTH_SETUP.md#1-google-oauth)
   - Redirect URI: `https://your-backend-url.onrender.com/auth/google/callback`

2. **Facebook OAuth**: [OAUTH_SETUP.md](OAUTH_SETUP.md#2-facebook-oauth)
   - Redirect URI: `https://your-backend-url.onrender.com/auth/facebook/callback`

3. Добавьте credentials в Environment Variables на Render

### Настройка Custom Domain (опционально)

Render позволяет добавить свой домен бесплатно:

1. Frontend Site → **Settings** → **Custom Domains**
2. Нажмите **"Add Custom Domain"**
3. Введите ваш домен (например: `mama.rs`)
4. Настройте DNS как указано Render
5. SSL сертификат установится автоматически!

---

## ⚠️ Важные замечания о бесплатном плане Render

### Холодный старт

- Backend засыпает после **15 минут** неактивности
- Первый запрос после сна займет **~30 секунд**
- Последующие запросы будут быстрыми

**Решение:** Используйте бесплатный cron job для "подогрева":
1. Зарегистрируйтесь на https://cron-job.org (бесплатно)
2. Создайте задачу которая делает GET запрос на ваш backend каждые 10 минут
3. URL: `https://your-backend-url.onrender.com/listings`

### Лимиты бесплатного плана

- **750 часов** в месяц (примерно 31 день × 24 часа = 744 часа)
- **512MB RAM**
- **Unlimited bandwidth**
- **Automatic deploys** при git push

---

## 📊 Monitoring & Logs

### Render Dashboard

- **Logs**: Просмотр логов в реальном времени
- **Metrics**: CPU, Memory, HTTP requests
- **Events**: История деплоев
- **Shell**: Доступ к консоли сервиса

### Neon Dashboard

- **Database size**: Текущий размер БД
- **Queries**: Статистика запросов
- **Branching**: Создание веток БД для тестирования
- **Backups**: Автоматические бэкапы (7 дней)

---

## 🔄 Обновление приложения

Когда вы делаете изменения в коде:

```bash
# Локально
git add .
git commit -m "Your changes"
git push
```

**Render автоматически:**
1. Обнаружит новый commit
2. Запустит build
3. Задеплоит новую версию
4. Без downtime для static site (frontend)

---

## 💰 Стоимость

### Абсолютно БЕСПЛАТНО!

**Neon (Free Tier):**
- ✅ 1 проект
- ✅ 10GB хранилища
- ✅ Unlimited queries
- ✅ Автоматическое масштабирование
- ✅ Point-in-time restore (7 дней)

**Render (Free Tier):**
- ✅ Unlimited static sites (frontend)
- ✅ 750 часов web services (backend)
- ✅ Автоматические deploys
- ✅ Custom domains
- ✅ Free SSL

**Общий траффик:** Достаточно для сотен пользователей в день!

---

## 🚀 Апгрейд (когда понадобится больше)

### Если backend засыпает слишком часто:

**Render Starter Plan: $7/месяц**
- Без холодных стартов
- Больше ресурсов

### Если нужно больше места в БД:

**Neon Launch Plan: $19/месяц**
- 10GB → 50GB
- Больше compute ресурсов
- Production-ready

---

## ✅ Checklist

- [ ] Создал аккаунт на Neon
- [ ] Создал PostgreSQL базу на Neon
- [ ] Скопировал DATABASE_URL
- [ ] Создал аккаунт на Render
- [ ] Задеплоил Backend на Render
- [ ] Добавил все environment variables
- [ ] Backend показывает статус "Live"
- [ ] Задеплоил Frontend на Render
- [ ] Frontend загружается в браузере
- [ ] Проверил регистрацию/логин работают
- [ ] (Опционально) Настроил OAuth
- [ ] (Опционально) Настроил custom domain
- [ ] (Опционально) Настроил cron job для keep-alive

---

## 🆘 Помощь

**Проблемы с деплоем?**
- GitHub Issues: https://github.com/RAZ-AR/mam_and_baby/issues
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs

**Часто задаваемые вопросы:**
- [QUICK_DEPLOY.md](QUICK_DEPLOY.md) - Общие вопросы
- [FREE_HOSTING.md](FREE_HOSTING.md) - Сравнение вариантов

---

🎉 **Поздравляю! Ваше приложение онлайн и доступно всему миру!** 🌍

**Ссылки на ваше приложение:**
- Frontend: `https://your-frontend.onrender.com`
- Backend: `https://your-backend.onrender.com`

Поделитесь с друзьями! 🚀
