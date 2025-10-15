# 🔧 РУЧНОЙ ДЕПЛОЙ на Render (Пошаговая инструкция)

Если Blueprint не работает - не проблема! Создадим сервисы вручную.

---

## 📋 ШАГ 1: Создаём Backend API (7 минут)

### 1.1 Начните создание сервиса

1. Зайдите: **https://dashboard.render.com**
2. Нажмите **"New +"** (синяя кнопка справа вверху)
3. Выберите **"Web Service"**

### 1.2 Подключите репозиторий

1. Нажмите **"Build and deploy from a Git repository"** → **"Next"**
2. Найдите репозиторий: **`belgrade-mama-marketplace`** или **`mam_and_baby`**
3. Нажмите **"Connect"**

### 1.3 Заполните настройки Backend

**Name:**
```
belgrade-mama-api
```

**Region:**
```
Frankfurt (EU Central)
```

**Branch:**
```
main
```

**Root Directory:**
```
(оставьте ПУСТЫМ - не заполняйте!)
```

**Runtime:**
```
Node
```

**Build Command:**
```
cd apps/api && npm install && npx prisma generate
```

**Start Command:**
```
cd apps/api && npx prisma migrate deploy && npm run start
```

**Instance Type:**
```
Free
```

### 1.4 Добавьте Environment Variables

Прокрутите вниз до секции **"Environment Variables"**.

Нажмите **"Add Environment Variable"** и добавьте по одной:

**1. DATABASE_URL**
```
postgresql://neondb_owner:npg_bKCHnzQ75xrI@ep-damp-surf-agvnau3d-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**2. JWT_SECRET**
```
SX24LyfnbnhB036bgthpv2fwzAfjcSzjHOhBCUx07D4=
```

**3. NODE_ENV**
```
production
```

**4. PORT**
```
10000
```

**5. CORS_ORIGIN**
```
https://belgrade-mama-web.onrender.com
```

### 1.5 Создайте сервис

1. Прокрутите вниз
2. Нажмите **"Create Web Service"**
3. Дождитесь деплоя (5-7 минут)
4. Следите за логами

### 1.6 Скопируйте Backend URL

После успешного деплоя вверху страницы будет URL вида:
```
https://belgrade-mama-api.onrender.com
```

**⚠️ СОХРАНИТЕ ЭТОТ URL** - он понадобится для Frontend!

---

## 📋 ШАГ 2: Создаём Frontend (5 минут)

### 2.1 Начните создание Static Site

1. Вернитесь на Dashboard: https://dashboard.render.com
2. Нажмите **"New +"**
3. Выберите **"Static Site"**

### 2.2 Подключите репозиторий

1. Найдите тот же репозиторий: **`belgrade-mama-marketplace`** или **`mam_and_baby`**
2. Нажмите **"Connect"**

### 2.3 Заполните настройки Frontend

**Name:**
```
belgrade-mama-web
```

**Branch:**
```
main
```

**Root Directory:**
```
(оставьте ПУСТЫМ - не заполняйте!)
```

**Build Command:**
```
cd apps/web && npm install && npm run build
```

**Publish Directory:**
```
apps/web/dist
```

### 2.4 Добавьте Environment Variable

Прокрутите до **"Environment Variables"**.

Добавьте:

**VITE_API_URL**
```
https://belgrade-mama-api.onrender.com
```
(или ваш реальный Backend URL из Шага 1.6)

### 2.5 Создайте Static Site

1. Прокрутите вниз
2. Нажмите **"Create Static Site"**
3. Дождитесь деплоя (3-5 минут)

### 2.6 Скопируйте Frontend URL

После деплоя вверху страницы будет URL вида:
```
https://belgrade-mama-web.onrender.com
```

---

## 📋 ШАГ 3: Обновите CORS на Backend

**ВАЖНО!** Теперь нужно обновить CORS, чтобы Frontend мог общаться с Backend.

### 3.1 Откройте Backend сервис

1. Render Dashboard → **belgrade-mama-api**
2. Слева в меню выберите **"Environment"**

### 3.2 Обновите CORS_ORIGIN

1. Найдите переменную **CORS_ORIGIN**
2. Нажмите на неё для редактирования
3. Замените значение на **реальный URL вашего Frontend**:
   ```
   https://belgrade-mama-web.onrender.com
   ```
   (или ваш реальный URL из Шага 2.6)
4. Нажмите **"Save Changes"**

### 3.3 Дождитесь передеплоя

Render автоматически передеплоит Backend (1-2 минуты).

---

## ✅ ШАГ 4: Проверка работы

### 4.1 Откройте ваш Frontend

В браузере откройте:
```
https://belgrade-mama-web.onrender.com
```
(ваш реальный URL)

### 4.2 Проверьте что сайт загружается

Вы должны увидеть:
- ✅ Главную страницу Belgrade Mama Marketplace
- ✅ Кнопки Register / Login
- ✅ Меню навигации

### 4.3 Проверьте регистрацию

1. Нажмите **"Register"**
2. Заполните форму:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
3. Нажмите **"Register"**
4. Если всё работает - вы будете перенаправлены в личный кабинет

### 4.4 Проверьте создание объявления

1. После входа нажмите **"Create Listing"** или **"Sell"**
2. Заполните форму объявления
3. Попробуйте загрузить фото
4. Нажмите **"Create"**
5. Проверьте что объявление появилось в каталоге

---

## 🐛 Решение проблем

### ❌ Backend не запускается

**Откройте логи:**
1. Render Dashboard → **belgrade-mama-api** → **"Logs"**

**Типичные ошибки:**

**"Can't reach database server"**
- DATABASE_URL неправильный
- Решение: Проверьте строку подключения из Neon
- Environment → DATABASE_URL → Edit → вставьте правильную строку

**"prisma migrate deploy failed"**
- Миграции не применились
- Решение:
  1. Backend Service → **"Shell"** (слева)
  2. Введите:
  ```bash
  cd apps/api
  npx prisma migrate deploy
  ```

**"Module not found"**
- Build не завершился
- Решение: Проверьте Build Command:
  ```
  cd apps/api && npm install && npx prisma generate
  ```

### ❌ Frontend показывает ошибки при логине

**Откройте консоль браузера (F12)**

**Network errors или 404:**
- VITE_API_URL неправильный
- Решение:
  1. Frontend Site → **"Environment"**
  2. Проверьте VITE_API_URL = URL вашего Backend
  3. Должен быть БЕЗ `/` в конце
  4. Save → Trigger Deploy

**CORS errors:**
- CORS_ORIGIN на Backend неправильный
- Решение:
  1. Backend Service → **"Environment"**
  2. CORS_ORIGIN = URL вашего Frontend
  3. Save → Backend передеплоится автоматически

### ❌ Frontend build fails

**Откройте логи:**
1. Frontend Site → **"Logs"**

**"Cannot find module" или "Build failed":**
- Проверьте команды:
  - Build Command: `cd apps/web && npm install && npm run build`
  - Publish Directory: `apps/web/dist`
- Settings → Edit → Save → Manual Deploy

---

## 📊 Мониторинг

### Backend логи:
```
Render Dashboard → belgrade-mama-api → Logs
```

### Frontend логи:
```
Render Dashboard → belgrade-mama-web → Logs
```

### Backend метрики:
```
Render Dashboard → belgrade-mama-api → Metrics
```

### Database мониторинг:
```
Neon Dashboard → ваш проект → Monitoring
```

---

## ⚠️ Важная информация

### Холодный старт Backend

- Backend засыпает после **15 минут** неактивности
- Первый запрос займет **~30 секунд**
- Решение: используйте бесплатный пингер https://uptimerobot.com

### Лимиты Free плана

**Render:**
- 750 часов/месяц для Backend
- Unlimited для Static Sites

**Neon:**
- 10GB база данных
- Unlimited запросы

---

## 🎉 Готово!

Ваше приложение работает!

**Ваши ссылки:**
- 🌐 Frontend: `https://belgrade-mama-web.onrender.com`
- ⚙️ Backend: `https://belgrade-mama-api.onrender.com`
- 🗄️ Database: Neon Dashboard

Поделитесь с друзьями! 🚀

---

## 📝 Чек-лист

- [ ] Backend создан и показывает статус "Live"
- [ ] Frontend создан и деплой завершен
- [ ] CORS_ORIGIN обновлен на Backend
- [ ] Frontend открывается в браузере
- [ ] Регистрация работает
- [ ] Логин работает
- [ ] Можно создать объявление
- [ ] Фото загружаются

---

## 🆘 Нужна помощь?

Если что-то не работает - напишите мне с:
- Описанием проблемы
- Скриншотом ошибки
- Логами (если есть)

Помогу разобраться! 🤝
