import { Router } from 'express';
import passport from '../lib/passport.js';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_auth_failed` }),
  (req, res) => {
    const { user, token } = req.user as any;
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name, avatar: user.avatar }))}`);
  }
);

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
  session: false
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=facebook_auth_failed` }),
  (req, res) => {
    const { user, token } = req.user as any;
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name, avatar: user.avatar }))}`);
  }
);

// Telegram OAuth - Temporarily disabled due to ES module compatibility issues
// TODO: Re-enable when passport-telegram-official is fixed or find alternative solution
// router.get('/telegram', passport.authenticate('telegram', { session: false }));
// router.get('/telegram/callback',
//   passport.authenticate('telegram', { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=telegram_auth_failed` }),
//   (req, res) => {
//     const { user, token } = req.user as any;
//     res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name, avatar: user.avatar }))}`);
//   }
// );

export default router;
