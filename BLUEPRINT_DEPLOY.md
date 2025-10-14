# 🚀 АВТОМАТИЧЕСКИЙ ДЕПЛОЙ через Render Blueprint

## ✨ Что это даёт?

С помощью `render.yaml` Render автоматически создаст:
- ✅ Backend API service
- ✅ Frontend Static Site
- ✅ Все environment variables
- ✅ Правильные настройки build/start команд

**Всё автоматически в один клик!**

---

## 📋 ШАГ 1: Закоммитьте изменения

Сначала нужно отправить обновленный `render.yaml` в GitHub:

```bash
git add render.yaml
git commit -m "Configure Render deployment with Neon database"
git push origin main
```

---

## 📋 ШАГ 2: Создайте аккаунт на Render

1. Откройте: **https://dashboard.render.com/register**
2. Нажмите **"Sign up with GitHub"**
3. Авторизуйте Render через GitHub

---

## 📋 ШАГ 3: Создайте Blueprint

### 3.1 Запустите создание Blueprint

1. В Render Dashboard нажмите **"New +"** (синяя кнопка справа вверху)
2. Выберите **"Blueprint"**

### 3.2 Подключите репозиторий

1. Если видите список репозиториев - найдите **`belgrade-mama-marketplace`**
2. Если НЕ видите ваш репозиторий:
   - Нажмите **"Configure GitHub account"**
   - Выберите **"Only select repositories"**
   - Найдите и добавьте **`belgrade-mama-marketplace`**
   - Вернитесь на Render и обновите страницу
3. Нажмите **"Connect"** рядом с вашим репозиторием

### 3.3 Render найдёт render.yaml

Render автоматически обнаружит файл `render.yaml` и покажет:

**Preview:**
- 📦 **belgrade-mama-api** (Web Service)
  - Region: Frankfurt
  - Plan: Free
  - Environment: Node

- 📦 **belgrade-mama-web** (Static Site)
  - Region: Frankfurt
  - Plan: Free

### 3.4 Подтвердите создание

1. Проверьте что показано **2 сервиса**:
   - `belgrade-mama-api` (Web Service)
   - `belgrade-mama-web` (Static Site)

2. Нажмите **"Apply"** или **"Create Resources"**

---

## 📋 ШАГ 4: Дождитесь деплоя

### Backend (belgrade-mama-api)

1. Render начнет build процесс для Backend
2. Вы увидите логи в реальном времени:
   ```
   ==> Installing dependencies...
   ==> Generating Prisma Client...
   ==> Running migrations...
   ==> Starting server...
   ```
3. Процесс займет **5-7 минут**
4. Дождитесь статуса **"Live"** (зеленый индикатор)

### Frontend (belgrade-mama-web)

1. Одновременно Render начнет build для Frontend
2. Логи будут показывать:
   ```
   ==> Installing dependencies...
   ==> Building with Vite...
   ==> Deploying static files...
   ```
3. Процесс займет **3-5 минут**
4. Дождитесь завершения деплоя

---

## 📋 ШАГ 5: Получите ваши URL

После успешного деплоя:

### Backend URL:
```
https://belgrade-mama-api.onrender.com
```

### Frontend URL:
```
https://belgrade-mama-web.onrender.com
```

**💡 Совет:** Если вы выбрали другие имена для сервисов, URL будут соответствующие.

---

## ✅ ШАГ 6: Проверьте работу

### 6.1 Проверьте Backend

Откройте в браузере:
```
https://belgrade-mama-api.onrender.com
```

Ожидаемый результат:
- `Cannot GET /`
- или JSON с ошибкой

**Это нормально!** Значит API работает.

### 6.2 Проверьте Frontend

Откройте:
```
https://belgrade-mama-web.onrender.com
```

Вы должны увидеть:
- ✅ Главную страницу Belgrade Mama Marketplace
- ✅ Кнопки Register/Login работают
- ✅ Страница загружается без ошибок

### 6.3 Тестируйте функционал

1. **Регистрация:**
   - Нажмите "Register"
   - Создайте тестовый аккаунт
   - Проверьте что редирект работает

2. **Создание объявления:**
   - Войдите в аккаунт
   - Создайте тестовое объявление
   - Попробуйте загрузить фото

3. **Просмотр объявлений:**
   - Перейдите в каталог
   - Проверьте поиск
   - Проверьте фильтры

---

## 🔧 ШАГ 7: Проверьте Environment Variables

Хотя все переменные уже настроены в `render.yaml`, рекомендую проверить:

### Backend Environment:

1. Render Dashboard → **belgrade-mama-api**
2. Слева выберите **"Environment"**
3. Проверьте что есть все переменные:
   - ✅ `DATABASE_URL` - строка подключения к Neon
   - ✅ `JWT_SECRET` - секретный ключ
   - ✅ `PORT` - 10000
   - ✅ `NODE_ENV` - production
   - ✅ `CORS_ORIGIN` - URL frontend

### Frontend Environment:

1. Render Dashboard → **belgrade-mama-web**
2. Выберите **"Environment"**
3. Проверьте:
   - ✅ `VITE_API_URL` - URL backend

---

## 🐛 Что делать если что-то не работает

### ❌ Backend не запускается

**Проверьте логи:**
1. Render Dashboard → **belgrade-mama-api** → **"Logs"**
2. Ищите ошибки (красный текст)

**Типичные проблемы:**

**Ошибка: "Can't reach database server"**
- DATABASE_URL неправильный
- Решение: Проверьте строку подключения из Neon
- Зайдите: Neon Dashboard → ваш проект → Connection Details
- Скопируйте правильную строку
- Обновите в Render: Environment → DATABASE_URL → Save

**Ошибка: "prisma migrate deploy failed"**
- Миграции не применились
- Решение: Запустите вручную:
  1. Backend Service → **"Shell"** (слева)
  2. Введите:
  ```bash
  cd apps/api
  npx prisma migrate deploy
  ```

**Ошибка: "npm: command not found"**
- Runtime не Node
- Решение: Проверьте в настройках сервиса что выбран **Runtime: Node**

### ❌ Frontend не видит Backend

**Ошибка 404 при логине/регистрации:**
- VITE_API_URL неправильный
- Решение:
  1. Frontend Site → **"Environment"**
  2. Проверьте VITE_API_URL = `https://belgrade-mama-api.onrender.com`
  3. URL должен быть **БЕЗ** `/` в конце

**CORS ошибки в консоли браузера (F12):**
- CORS_ORIGIN на Backend неправильный
- Решение:
  1. Backend Service → **"Environment"**
  2. CORS_ORIGIN = `https://belgrade-mama-web.onrender.com`
  3. Сохраните → Backend передеплоится автоматически (1-2 мин)

### ❌ Frontend build fails

**Ошибка: "Cannot find module"**
- Build Command неправильный
- Решение:
  1. Frontend Site → **"Settings"**
  2. Build Command: `cd apps/web && npm install && npm run build`
  3. Publish Directory: `apps/web/dist`
  4. Save → Trigger deploy вручную

---

## 🔄 Как обновить приложение

После внесения изменений в код:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Render автоматически:**
1. Обнаружит новый commit
2. Запустит build для изменённых сервисов
3. Задеплоит новую версию
4. Обновление займет 3-7 минут

---

## ⚙️ Как изменить настройки Blueprint

Если нужно изменить имена сервисов, регионы или другие настройки:

### Вариант 1: Изменить render.yaml

1. Откройте файл `render.yaml`
2. Измените нужные параметры:
   ```yaml
   - type: web
     name: my-new-api-name  # Изменили имя
     region: oregon         # Изменили регион
   ```
3. Закоммитьте и запушьте:
   ```bash
   git add render.yaml
   git commit -m "Update Render config"
   git push
   ```
4. Render автоматически применит изменения

### Вариант 2: Изменить в Dashboard

1. Render Dashboard → ваш сервис
2. **"Settings"** (слева)
3. Измените нужные параметры
4. **"Save Changes"**

---

## 🎯 Добавление OAuth (опционально)

Если хотите добавить Google/Facebook логин:

### 1. Получите credentials:

**Google OAuth:**
- https://console.cloud.google.com
- Создайте OAuth Client ID
- Redirect URI: `https://belgrade-mama-api.onrender.com/auth/google/callback`

**Facebook OAuth:**
- https://developers.facebook.com
- Создайте приложение
- Redirect URI: `https://belgrade-mama-api.onrender.com/auth/facebook/callback`

### 2. Добавьте в render.yaml:

Откройте `render.yaml` и добавьте в секцию `envVars` для Backend:

```yaml
envVars:
  # ... существующие переменные ...

  - key: GOOGLE_CLIENT_ID
    value: your-google-client-id
  - key: GOOGLE_CLIENT_SECRET
    value: your-google-client-secret
  - key: FACEBOOK_APP_ID
    value: your-facebook-app-id
  - key: FACEBOOK_APP_SECRET
    value: your-facebook-app-secret
```

### 3. Закоммитьте и запушьте:

```bash
git add render.yaml
git commit -m "Add OAuth credentials"
git push
```

Render автоматически обновит переменные окружения.

---

## 📊 Мониторинг

### Логи в реальном времени:

**Backend:**
```
Render Dashboard → belgrade-mama-api → Logs
```

**Frontend:**
```
Render Dashboard → belgrade-mama-web → Logs
```

### Метрики:

**Backend:**
```
Render Dashboard → belgrade-mama-api → Metrics
```
- CPU usage
- Memory usage
- Request count
- Response time

**Database:**
```
Neon Dashboard → ваш проект → Monitoring
```
- Database size
- Active connections
- Query statistics

---

## ⚠️ Важная информация

### Холодный старт Backend

- Backend **засыпает** после **15 минут** неактивности
- Первый запрос займет **~30 секунд**
- Последующие запросы будут быстрыми

**Решение:** Используйте бесплатный пингер:
- https://uptimerobot.com (бесплатно)
- Создайте monitor для `https://belgrade-mama-api.onrender.com`
- Интервал проверки: каждые 5 минут

### Лимиты бесплатного плана

**Render:**
- 750 часов/месяц для Backend
- Unlimited для Static Sites
- 512MB RAM
- Бесплатный SSL

**Neon:**
- 10GB база данных
- Unlimited queries
- Автоматические бэкапы (7 дней)

---

## 🎉 Готово!

Ваше приложение полностью развернуто и работает!

**Ваши ссылки:**
- 🌐 Frontend: `https://belgrade-mama-web.onrender.com`
- ⚙️ Backend: `https://belgrade-mama-api.onrender.com`
- 🗄️ Database: Neon Dashboard

**Что дальше?**
1. Поделитесь ссылкой с друзьями
2. Настройте custom domain (опционально)
3. Настройте OAuth (опционально)
4. Настройте мониторинг/пингер
5. Наслаждайтесь! 🚀

---

## 📝 Полезные ссылки

- **Render Dashboard**: https://dashboard.render.com
- **Neon Dashboard**: https://console.neon.tech
- **Render Docs**: https://render.com/docs/blueprint-spec
- **GitHub Repo**: https://github.com/RAZ-AR/mam_and_baby
