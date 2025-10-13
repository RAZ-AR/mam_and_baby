import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import TelegramStrategy from 'passport-telegram-official'; // TODO: Fix ES module issues
import { prisma } from './prisma.js';
import { generateToken } from './auth.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

// Google OAuth Strategy
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Try to find existing user
          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email, provider: 'google' },
                { providerId: profile.id, provider: 'google' },
              ],
            },
          });

          if (!user) {
            // Create new user
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || 'User',
                provider: 'google',
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value,
              },
            });
          } else {
            // Update avatar if changed
            if (profile.photos?.[0]?.value && profile.photos[0].value !== user.avatar) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { avatar: profile.photos[0].value },
              });
            }
          }

          const token = generateToken({ userId: user.id, email: user.email });
          done(null, { user, token });
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

// Facebook OAuth Strategy
if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: `${BACKEND_URL}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'email', 'photos'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Facebook profile'));
          }

          let user = await prisma.user.findFirst({
            where: {
              OR: [
                { email, provider: 'facebook' },
                { providerId: profile.id, provider: 'facebook' },
              ],
            },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email,
                name: profile.displayName || 'User',
                provider: 'facebook',
                providerId: profile.id,
                avatar: profile.photos?.[0]?.value,
              },
            });
          } else {
            if (profile.photos?.[0]?.value && profile.photos[0].value !== user.avatar) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { avatar: profile.photos[0].value },
              });
            }
          }

          const token = generateToken({ userId: user.id, email: user.email });
          done(null, { user, token });
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

// Telegram OAuth Strategy
// TODO: Fix passport-telegram-official ES module compatibility issues
// if (TELEGRAM_BOT_TOKEN) {
//   passport.use(
//     new TelegramStrategy(
//       {
//         botToken: TELEGRAM_BOT_TOKEN,
//       },
//       async (profile: any, done: any) => {
//         try {
//           const telegramId = profile.id.toString();
//           const username = profile.username || `user_${telegramId}`;
//           const email = `${telegramId}@telegram.user`;
//
//           let user = await prisma.user.findFirst({
//             where: {
//               providerId: telegramId,
//               provider: 'telegram',
//             },
//           });
//
//           if (!user) {
//             const existingEmail = await prisma.user.findUnique({
//               where: { email },
//             });
//
//             if (existingEmail) {
//               return done(new Error('An account with this email already exists'));
//             }
//
//             user = await prisma.user.create({
//               data: {
//                 email,
//                 name: `${profile.first_name} ${profile.last_name || ''}`.trim() || username,
//                 provider: 'telegram',
//                 providerId: telegramId,
//                 avatar: profile.photo_url,
//               },
//             });
//           } else {
//             if (profile.photo_url && profile.photo_url !== user.avatar) {
//               user = await prisma.user.update({
//                 where: { id: user.id },
//                 data: { avatar: profile.photo_url },
//               });
//             }
//           }
//
//           const token = generateToken({ userId: user.id, email: user.email });
//           done(null, { user, token });
//         } catch (error) {
//           done(error as Error);
//         }
//       }
//     )
//   );
// }

export default passport;
