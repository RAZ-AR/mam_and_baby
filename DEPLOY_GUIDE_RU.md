# 🚀 ПОШАГОВАЯ ИНСТРУКЦИЯ: Развертывание на Render + Neon

## ✅ ЧТО НУЖНО СДЕЛАТЬ (3 основных шага)

### Шаг 1️⃣: Создать базу данных Neon (5 минут)
### Шаг 2️⃣: Развернуть Backend на Render (10 минут)
### Шаг 3️⃣: Развернуть Frontend на Render (5 минут)

---

## 📋 ШАГ 1: NEON - База данных PostgreSQL

### 1.1 Создайте аккаунт на Neon

1. Откройте: **https://console.neon.tech/signup**
2. Нажмите: **"Sign up with GitHub"**
3. Авторизуйте Neon через GitHub
4. Подтвердите email если попросит

### 1.2 Создайте проект и базу данных

1. После входа нажмите **"Create a project"**
2. Заполните:
   - **Project name**: `belgrade-mama`
   - **Database name**: `marketplace`
   - **Region**: **Europe (Frankfurt)** - ближе всего к Белграду
3. Нажмите **"Create project"**

### 1.3 Скопируйте строку подключения

После создания проекта вы увидите **Connection String**:

```
postgresql://username:password@ep-xxx-xxx.eu-central-1.aws.neon.tech/marketplace?sslmode=require
```

**⚠️ ВАЖНО: СОХРАНИТЕ ЭТУ СТРОКУ!** Она понадобится на следующем шаге.

Если случайно закрыли:
- Зайдите в Dashboard
- Выберите ваш проект
- Нажмите **"Connection Details"**
- Скопируйте **"Connection string"**

✅ **Шаг 1 завершен!** У вас есть PostgreSQL база на 10GB.

---

## 📋 ШАГ 2: RENDER - Backend API

### 2.1 Создайте аккаунт на Render

1. Откройте: **https://dashboard.render.com/register**
2. Нажмите: **"Sign up with GitHub"**
3. Авторизуйте Render через GitHub

### 2.2 Подключите ваш GitHub репозиторий

1. На Render Dashboard нажмите **"New +"** (синяя кнопка справа вверху)
2. Выберите **"Web Service"**
3. Нажмите **"Build and deploy from a Git repository"** → **"Next"**
4. Если видите список репозиториев - найдите **`belgrade-mama-marketplace`**
5. Если НЕ видите ваш репозиторий:
   - Нажмите **"Configure account"** справа
   - Выберите **"Only select repositories"**
   - Найдите и добавьте **`belgrade-mama-marketplace`**
   - Вернитесь на Render и обновите страницу
6. Нажмите **"Connect"** рядом с вашим репозиторием

### 2.3 Настройте Backend Service

Заполните форму **ТОЧНО ТАК**:

#### **Basic Info:**
- **Name**: `belgrade-mama-api` (можете изменить)
- **Region**: **Frankfurt (EU Central)**
- **Branch**: `main`
- **Root Directory**: оставьте **ПУСТЫМ** (не заполняйте)

#### **Build & Deploy:**
- **Runtime**: **Node**

- **Build Command**:
```bash
cd apps/api && npm install && npx prisma generate
```

- **Start Command**:
```bash
cd apps/api && npx prisma migrate deploy && npm run start
```

#### **Plan:**
- **Instance Type**: **Free** (должно быть выбрано по умолчанию)

### 2.4 Добавьте Environment Variables

Прокрутите вниз до **"Environment Variables"**. Добавьте следующие переменные:

#### **ОБЯЗАТЕЛЬНЫЕ:**

1. **DATABASE_URL**
   - Value: `ваша строка подключения из Neon из Шага 1.3`
   - Пример: `postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/marketplace?sslmode=require`

2. **JWT_SECRET**
   - Value: `your-super-secret-jwt-key-minimum-32-characters-long`
   - (Или сгенерируйте длинный случайный ключ)

3. **NODE_ENV**
   - Value: `production`

4. **PORT**
   - Value: `10000`

5. **CORS_ORIGIN**
   - Value: `https://belgrade-mama-web.onrender.com`
   - (Замените `belgrade-mama-web` на имя которое выберете для frontend в Шаге 3)

#### **ОПЦИОНАЛЬНЫЕ (для OAuth):**

6. **GOOGLE_CLIENT_ID** (если есть)
   - Value: `ваш Google client ID`

7. **GOOGLE_CLIENT_SECRET** (если есть)
   - Value: `ваш Google client secret`

8. **FACEBOOK_APP_ID** (если есть)
   - Value: `ваш Facebook app ID`

9. **FACEBOOK_APP_SECRET** (если есть)
   - Value: `ваш Facebook app secret`

### 2.5 Запустите деплой Backend

1. Прокрутите вниз и нажмите **"Create Web Service"**
2. Render начнет build процесс (занимает 5-7 минут)
3. Следите за логами - там будут показаны все шаги
4. Дождитесь пока статус станет **"Live"** (зеленый индикатор)

### 2.6 Скопируйте URL вашего Backend

После успешного деплоя вы увидите URL вида:
```
https://belgrade-mama-api.onrender.com
```

**⚠️ СОХРАНИТЕ ЭТОТ URL!** Он понадобится для frontend.

✅ **Шаг 2 завершен!** Ваш Backend API работает.

---

## 📋 ШАГ 3: RENDER - Frontend (Static Site)

### 3.1 Создайте Static Site

1. Вернитесь на Render Dashboard
2. Нажмите **"New +"** → **"Static Site"**
3. Выберите ваш репозиторий: **`belgrade-mama-marketplace`**
4. Нажмите **"Connect"**

### 3.2 Настройте Frontend Site

Заполните форму **ТОЧНО ТАК**:

#### **Basic Info:**
- **Name**: `belgrade-mama-web` (можете изменить)
- **Branch**: `main`
- **Root Directory**: оставьте **ПУСТЫМ**

#### **Build Settings:**
- **Build Command**:
```bash
cd apps/web && npm install && npm run build
```

- **Publish Directory**:
```
apps/web/dist
```

### 3.3 Добавьте Environment Variable

В секции **"Environment Variables"** добавьте:

1. **VITE_API_URL**
   - Value: `ваш Backend URL из Шага 2.6`
   - Пример: `https://belgrade-mama-api.onrender.com`

### 3.4 Запустите деплой Frontend

1. Нажмите **"Create Static Site"**
2. Render начнет build (занимает 3-5 минут)
3. Дождитесь завершения
4. **Скопируйте URL** вашего сайта

Ваш сайт будет доступен по адресу:
```
https://belgrade-mama-web.onrender.com
```

✅ **Шаг 3 завершен!** Ваш Frontend работает.

---

## 🔄 ШАГ 4: Обновите CORS на Backend

**ВАЖНО:** Теперь нужно обновить CORS настройки на Backend.

1. Вернитесь в Render Dashboard
2. Откройте ваш **Backend service** (`belgrade-mama-api`)
3. Слева в меню выберите **"Environment"**
4. Найдите переменную **CORS_ORIGIN**
5. Обновите её значение на **реальный URL вашего frontend**:
   - Например: `https://belgrade-mama-web.onrender.com`
6. Нажмите **"Save Changes"**
7. Render автоматически передеплоит backend (1-2 минуты)

✅ **Готово!** Теперь Frontend может общаться с Backend.

---

## ✅ ПРОВЕРКА РАБОТЫ

### 1. Проверьте Backend

Откройте в браузере ваш Backend URL:
```
https://your-backend.onrender.com
```

Вы должны увидеть: `Cannot GET /` или JSON ошибку - это нормально, API работает!

### 2. Проверьте Frontend

Откройте ваш Frontend URL:
```
https://your-frontend.onrender.com
```

Вы должны увидеть главную страницу Belgrade Mama Marketplace.

### 3. Протестируйте функционал

1. Нажмите **"Register"** или **"Login"**
2. Зарегистрируйте тестовый аккаунт
3. Попробуйте создать объявление
4. Проверьте что фото загружаются

---

## 🐛 ЧТО ДЕЛАТЬ ЕСЛИ НЕ РАБОТАЕТ

### Backend не запускается

**Проверьте логи:**
1. Render Dashboard → Backend Service → **"Logs"** (слева)
2. Ищите красный текст с ошибками

**Типичные проблемы:**

❌ **Ошибка: "Can't reach database server"**
- **Решение:** Проверьте что DATABASE_URL правильный
- Зайдите в Neon Dashboard и скопируйте строку подключения заново
- Обновите переменную DATABASE_URL на Render

❌ **Ошибка: "prisma migrate deploy failed"**
- **Решение:** Запустите миграции вручную:
  1. Backend Service → **"Shell"** (слева в меню)
  2. Введите:
  ```bash
  cd apps/api
  npx prisma migrate deploy
  ```

❌ **Ошибка: "npm: command not found"**
- **Решение:** Проверьте что Runtime выбран **Node**

### Frontend не видит Backend

❌ **Ошибка 404 при регистрации/логине**
- **Решение:** Проверьте VITE_API_URL
- Убедитесь что URL без `/` в конце
- Правильно: `https://belgrade-mama-api.onrender.com`
- Неправильно: `https://belgrade-mama-api.onrender.com/`

❌ **CORS ошибки в консоли браузера**
- **Решение:** Обновите CORS_ORIGIN на Backend (см. Шаг 4)

### Frontend build fails

❌ **Ошибка: "Cannot find module"**
- **Решение:** Проверьте Build Command и Publish Directory
- Build: `cd apps/web && npm install && npm run build`
- Publish: `apps/web/dist`

---

## 📊 МОНИТОРИНГ

### Где смотреть логи

**Backend:**
- Render Dashboard → Backend Service → **"Logs"**
- Здесь показываются все запросы и ошибки

**Frontend:**
- Render Dashboard → Static Site → **"Logs"**
- Здесь показывается процесс build

### Где смотреть метрики

**Backend:**
- Render Dashboard → Backend Service → **"Metrics"**
- CPU, Memory, Request count

**Database:**
- Neon Dashboard → ваш проект → **"Monitoring"**
- Размер БД, количество запросов

---

## 🔄 КАК ОБНОВИТЬ ПРИЛОЖЕНИЕ

Когда вы делаете изменения в коде:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**Render автоматически:**
1. Обнаружит новый commit
2. Запустит build
3. Задеплоит новую версию
4. Обновление займет 3-5 минут

---

## ⚠️ ВАЖНАЯ ИНФОРМАЦИЯ О БЕСПЛАТНОМ ПЛАНЕ

### Холодный старт Backend

- Backend **засыпает** после **15 минут** неактивности
- Первый запрос после "сна" займет **30 секунд**
- Последующие запросы будут быстрыми

**Решение:** Используйте бесплатный пингер
- Зарегистрируйтесь на https://uptimerobot.com (бесплатно)
- Создайте monitor для вашего Backend URL
- Интервал: каждые 5 минут
- Это не даст Backend засыпать

### Лимиты

**Render Free:**
- 750 часов/месяц (≈ 31 день)
- 512MB RAM
- После 15 минут неактивности - холодный старт

**Neon Free:**
- 10GB база данных
- Неограниченные запросы
- Автоматические бэкапы (7 дней)

---

## 💰 СТОИМОСТЬ

### 100% БЕСПЛАТНО!

Без кредитной карты. Навсегда бесплатно для небольших проектов.

### Если захотите апгрейд:

**Render Starter ($7/мес):**
- Без холодных стартов
- Больше памяти

**Neon Launch ($19/мес):**
- 50GB база
- Больше ресурсов

---

## 📝 CHECKLIST

Отмечайте по мере выполнения:

- [ ] 1.1 Создал аккаунт на Neon
- [ ] 1.2 Создал проект и базу данных
- [ ] 1.3 Скопировал DATABASE_URL
- [ ] 2.1 Создал аккаунт на Render
- [ ] 2.2 Подключил GitHub репозиторий
- [ ] 2.3 Заполнил настройки Backend
- [ ] 2.4 Добавил все Environment Variables
- [ ] 2.5 Backend успешно задеплоился (статус "Live")
- [ ] 2.6 Скопировал Backend URL
- [ ] 3.1 Создал Static Site для Frontend
- [ ] 3.2 Заполнил настройки Frontend
- [ ] 3.3 Добавил VITE_API_URL
- [ ] 3.4 Frontend успешно задеплоился
- [ ] 4.0 Обновил CORS_ORIGIN на Backend
- [ ] ✅ Проверил работу: регистрация работает
- [ ] ✅ Проверил работу: создание объявлений работает

---

## 🆘 ПОМОЩЬ

Если что-то не получается:

1. **Проверьте логи** на Render (Backend и Frontend)
2. **Откройте консоль браузера** (F12) и проверьте ошибки
3. **Сравните настройки** с этой инструкцией
4. **GitHub Issues**: https://github.com/RAZ-AR/mam_and_baby/issues

---

## 🎉 ПОЗДРАВЛЯЮ!

Ваше приложение онлайн и доступно всему миру!

**Ваши ссылки:**
- 🌐 Frontend: `https://your-frontend.onrender.com`
- ⚙️ Backend: `https://your-backend.onrender.com`
- 🗄️ Database: Neon Dashboard

Поделитесь с друзьями! 🚀
