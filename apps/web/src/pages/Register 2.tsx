import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, error, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name, formData.phone || undefined);
      navigate('/');
    } catch (err: any) {
      setLocalError(err.response?.data?.error || 'Registration failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium mb-8 transition-colors duration-200"
        >
          <span>←</span>
          <span>{t('backToHome') || 'Back to Home'}</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl shadow-card mb-4">
              <span className="text-white text-3xl font-bold">✨</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              {t('registerTitle')}
            </h2>
            <p className="text-gray-600">
              {t('registerSubtitle') || 'Join the Belgrade Mama community'}
            </p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-6 p-4 bg-gradient-to-r from-error-50 to-error-100 border-2 border-error-200 text-error-700 rounded-2xl animate-scale-in flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-medium">{displayError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('formName')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">👤</span>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('formEmail')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📧</span>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('formPhone')} <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📱</span>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+381 11 234 5678"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('formPassword')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔒</span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                {t('formConfirmPassword')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔐</span>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-secondary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none font-medium"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600 rounded-2xl text-white font-bold text-lg shadow-card hover:shadow-card-hover transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  <span>Creating account...</span>
                </span>
              ) : (
                t('registerButton')
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              {t('haveAccount') || 'Already have an account?'}{' '}
              <Link
                to="/login"
                className="font-bold text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
              >
                {t('loginLink') || 'Sign in'}
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('registerInfo') || 'By signing up, you agree to our Terms of Service'}
        </p>
      </div>
    </div>
  );
}
