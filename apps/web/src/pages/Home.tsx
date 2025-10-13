import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listingsApi, isoApi, Listing, ISO } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Home(){
  const { t, i18n } = useTranslation();
  const { user, fetchUser, logout } = useAuthStore();
  const [tab, setTab] = useState<'prod'|'iso'>('prod');

  const [listings, setListings] = useState<Listing[]>([]);
  const [isos, setIsos] = useState<ISO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    age: '',
    size: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const apiFilters: any = {};
        if (filters.search) apiFilters.search = filters.search;
        if (filters.district) apiFilters.district = filters.district;
        if (filters.minPrice) apiFilters.minPrice = Number(filters.minPrice);
        if (filters.maxPrice) apiFilters.maxPrice = Number(filters.maxPrice);
        if (filters.age) apiFilters.age = filters.age;
        if (filters.size) apiFilters.size = filters.size;

        const [listingsData, isosData] = await Promise.all([
          listingsApi.getAll(Object.keys(apiFilters).length > 0 ? apiFilters : undefined),
          isoApi.getFeed(),
        ]);
        setListings(listingsData);
        setIsos(isosData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      district: '',
      minPrice: '',
      maxPrice: '',
      age: '',
      size: '',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-2xl font-bold">B</span>
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t('appName')}
              </span>
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-primary-300 focus:outline-none focus:border-primary-500 transition-colors duration-200 cursor-pointer"
                value={i18n.language}
                onChange={(e)=>i18n.changeLanguage(e.target.value)}
              >
                <option value="sr-Latn">🇷🇸 Srpski</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇬🇧 English</option>
              </select>

              {user ? (
                <>
                  <Link
                    to="/orders"
                    className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  >
                    <span className="text-xl">📦</span>
                    <span>{t('orders') || 'Заказы'}</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 rounded-xl text-primary-700 font-medium transition-all duration-200"
                  >
                    <span className="text-xl">👤</span>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                  >
                    {t('logoutButton')}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-white border-2 border-gray-200 hover:border-primary-500 rounded-xl text-gray-700 hover:text-primary-600 font-semibold transition-all duration-200"
                >
                  {t('loginButton')}
                </Link>
              )}
              <Link
                to="/listing/new"
                className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl text-white font-semibold shadow-soft hover:shadow-card transition-all duration-200 transform hover:scale-105"
              >
                <span className="hidden sm:inline">{t('ctaCreateListing')}</span>
                <span className="sm:hidden">+</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t('heroTitle') || 'Добро пожаловать! 👋'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            {t('heroSubtitle') || 'Маркетплейс для мам в Белграде'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <button
            onClick={()=>setTab('prod')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
              tab==='prod'
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-card transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
            }`}
          >
            🛍️ {t('tabProducts')}
          </button>
          <button
            onClick={()=>setTab('iso')}
            className={`flex-1 sm:flex-none px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
              tab==='iso'
                ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-card transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-soft'
            }`}
          >
            🔍 {t('tabISO')}
          </button>
          <Link
            to="/iso/new"
            className="hidden sm:flex items-center ml-auto px-6 py-3.5 bg-white hover:bg-accent-50 border-2 border-accent-200 hover:border-accent-400 rounded-2xl text-accent-700 font-semibold transition-all duration-200"
          >
            + {t('ctaCreateISO')}
          </Link>
        </div>

        {/* Search and Filter Section */}
        {tab === 'prod' && (
          <div className="mb-6 bg-white rounded-3xl shadow-card p-6 animate-scale-in" style={{animationDelay: '0.2s'}}>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')!}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-2xl text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                    showFilters
                      ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>⚙️</span>
                    <span className="hidden sm:inline">{t('filters')}</span>
                  </span>
                </button>
                {(filters.search || filters.district || filters.minPrice || filters.maxPrice || filters.age || filters.size) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-6 py-4 rounded-2xl border-2 border-error-200 bg-error-50 text-error-600 hover:bg-error-100 font-semibold transition-all duration-200"
                  >
                    ✕ {t('clearFilters')}
                  </button>
                )}
              </div>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-100 animate-slide-up">
                <input
                  type="text"
                  placeholder={`📍 ${t('formDistricts')}`}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-xl transition-all duration-200 outline-none"
                  value={filters.district}
                  onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={`👶 ${t('formAge')}`}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-xl transition-all duration-200 outline-none"
                  value={filters.age}
                  onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                />
                <input
                  type="text"
                  placeholder={`📏 ${t('formSize')}`}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-xl transition-all duration-200 outline-none"
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                />
                <input
                  type="number"
                  placeholder={`💰 ${t('minPrice')}`}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-xl transition-all duration-200 outline-none"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
                <input
                  type="number"
                  placeholder={`💰 ${t('maxPrice')}`}
                  className="px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary-400 focus:bg-white rounded-xl transition-all duration-200 outline-none"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            )}

            {/* Results Count */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="inline-block w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span className="text-gray-600 font-medium">
                {t('resultsFound', { count: listings.length })}
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-error-50 to-error-100 border-2 border-error-200 text-error-700 rounded-2xl animate-scale-in font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-primary-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && tab==='prod' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.length === 0 ? (
              <div className="col-span-full text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-xl text-gray-600 font-medium mb-2">No listings yet</p>
                <p className="text-gray-500">Be the first to create one!</p>
              </div>
            ) : (
              listings.map((l, idx)=>(
                <Link
                  key={l.id}
                  to={`/listing/${l.id}`}
                  className="group bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-1 animate-scale-in"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={l.photos[0]?.url || 'https://picsum.photos/seed/default/400/300'}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-primary-600 shadow-soft">
                        {l.price} RSD
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-1">
                      {l.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span>📍</span>
                      <span>{l.district}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {l.user.name[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600">{l.user.name}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* ISO List */}
        {!loading && tab==='iso' && (
          <div className="space-y-4">
            {isos.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-gray-600 font-medium">No ISO requests yet</p>
              </div>
            ) : (
              isos.map((i, idx)=>(
                <div
                  key={i.id}
                  className="bg-white rounded-3xl shadow-card hover:shadow-card-hover p-6 transition-all duration-300 animate-scale-in"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{i.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-6 h-6 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {i.user.name[0].toUpperCase()}
                        </div>
                        <span>{i.user.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-4 py-2 bg-accent-50 text-accent-700 rounded-xl font-semibold text-sm">
                        ⏳ {i.daysLeft}d
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
