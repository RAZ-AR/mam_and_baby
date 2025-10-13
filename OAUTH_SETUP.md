# OAuth Authentication Setup Guide

This guide explains how to set up OAuth authentication with Google, Facebook, and Telegram for the Belgrade Mama marketplace.

## Features

- ✅ Google OAuth 2.0
- ✅ Facebook OAuth 2.0
- 🚧 Telegram Login Widget (temporarily disabled due to ES module compatibility issues)
- ✅ Automatic user account creation
- ✅ Profile picture sync
- ✅ Secure token-based authentication

## Setup Instructions

### 1. Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:4000/auth/google/callback`
7. Copy your Client ID and Client Secret
8. Add to `/apps/api/.env`:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

### 2. Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. Go to Settings → Basic
5. Copy your App ID and App Secret
6. Go to Facebook Login → Settings
7. Add Valid OAuth Redirect URI: `http://localhost:4000/auth/facebook/callback`
8. Add to `/apps/api/.env`:
   ```
   FACEBOOK_APP_ID=your-app-id-here
   FACEBOOK_APP_SECRET=your-app-secret-here
   ```

### 3. Telegram OAuth

**⚠️ Currently Disabled**: Telegram OAuth is temporarily unavailable due to ES module compatibility issues with the `passport-telegram-official` package. We're working on a solution.

<details>
<summary>Setup instructions (for when it's re-enabled)</summary>

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow instructions to create a bot
3. Copy the bot token provided by BotFather
4. Send `/setdomain` to BotFather
5. Choose your bot and set domain to `localhost` (for development)
6. Add to `/apps/api/.env`:
   ```
   TELEGRAM_BOT_TOKEN=your-bot-token-here
   ```
</details>

## Database Schema

The User model has been updated to support OAuth:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String?  // Optional for OAuth users
  name      String
  phone     String?

  // OAuth fields
  provider       String?  // 'google', 'facebook', 'telegram', 'local'
  providerId     String?  // OAuth provider user ID
  avatar         String?  // Profile picture URL

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([provider, providerId])
}
```

## API Endpoints

### Google
- **Start**: `GET /auth/google`
- **Callback**: `GET /auth/google/callback`

### Facebook
- **Start**: `GET /auth/facebook`
- **Callback**: `GET /auth/facebook/callback`

### Telegram (Currently Disabled)
- ~~**Start**: `GET /auth/telegram`~~
- ~~**Callback**: `GET /auth/telegram/callback`~~

## Flow

1. User clicks OAuth button on Login page (Google or Facebook)
2. User is redirected to provider (Google/Facebook)
3. User authorizes the app
4. Provider redirects back to `/auth/{provider}/callback`
5. Backend creates/updates user account
6. Backend generates JWT token
7. Backend redirects to `/auth/callback?token=xxx&user=xxx`
8. Frontend saves token and user data
9. Frontend redirects to home page

**Note**: Telegram OAuth flow is currently disabled.

## Security Notes

- OAuth credentials should NEVER be committed to version control
- Use environment variables for all sensitive data
- In production, update redirect URIs to use HTTPS
- Implement CSRF protection for OAuth flows
- Rotate secrets regularly

## Testing

1. Start the backend: `pnpm dev:api`
2. Start the frontend: `pnpm dev:web`
3. Go to http://localhost:5173/login
4. Click on Google or Facebook button (Telegram is temporarily disabled)
5. Complete OAuth flow
6. You should be redirected to home page logged in

## Troubleshooting

### Google OAuth not working
- Check redirect URI matches exactly
- Ensure Google+ API is enabled
- Verify Client ID/Secret are correct

### Facebook OAuth not working
- Check App is in "Live" mode (not Development)
- Verify redirect URI is added to allowed list
- Ensure email permission is requested

### Telegram OAuth not working
**Telegram OAuth is currently disabled** due to ES module compatibility issues with the `passport-telegram-official` package. Alternative solutions are being explored:
- Using Telegram Login Widget directly (client-side)
- Finding an alternative passport strategy package
- Implementing custom Telegram OAuth integration

## Production Deployment

Before deploying to production:

1. Update redirect URIs to production URLs:
   - Google: `https://yourdomain.com/auth/google/callback`
   - Facebook: `https://yourdomain.com/auth/facebook/callback`
   - Telegram: Set domain to `yourdomain.com`

2. Update environment variables:
   ```
   BACKEND_URL=https://api.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

3. Use HTTPS for all OAuth flows
4. Implement rate limiting on OAuth endpoints
5. Add logging and monitoring

## Support

For issues or questions, please check:
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Docs](https://developers.facebook.com/docs/facebook-login)
- [Telegram Login Widget](https://core.telegram.org/widgets/login)
