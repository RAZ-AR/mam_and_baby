import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listingsApi, isoApi, Listing, ISO } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [tab, setTab] = useState<'listings' | 'isos'>('listings');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isos, setIsos] = useState<ISO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      setError('');

      try {
        const [listingsData, isosData] = await Promise.all([
          listingsApi.getMyListings(),
          isoApi.getMyISOs(),
        ]);
        setListings(listingsData);
        setIsos(isosData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch your data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← {t('backToHome')}
      </Link>

      {/* User Info Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-600">✉️ {user.email}</p>
            {user.phone && <p className="text-gray-600">📞 {user.phone}</p>}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{listings.length}</div>
            <div className="text-sm text-gray-600">{t('activeListings')}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('listings')}
          className={`px-4 py-2 rounded-2xl border ${
            tab === 'listings' ? 'bg-black text-white' : 'bg-white'
          }`}
        >
          {t('myListings')} ({listings.length})
        </button>
        <button
          onClick={() => setTab('isos')}
          className={`px-4 py-2 rounded-2xl border ${
            tab === 'isos' ? 'bg-black text-white' : 'bg-white'
          }`}
        >
          {t('myISOs')} ({isos.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {/* Listings Tab */}
      {!loading && tab === 'listings' && (
        <div>
          {listings.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl shadow">
              <p className="text-gray-500 mb-4">{t('noListingsYet')}</p>
              <Link
                to="/listing/new"
                className="inline-block px-4 py-2 rounded-2xl bg-black text-white"
              >
                {t('ctaCreateListing')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="rounded-2xl shadow bg-white hover:shadow-lg transition-shadow"
                >
                  <img
                    src={listing.photos[0]?.url || 'https://picsum.photos/seed/default/400/300'}
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <div className="p-3">
                    <div className="font-semibold">{listing.title}</div>
                    <div className="text-sm text-gray-600">{listing.district}</div>
                    <div className="mt-1 font-bold">{listing.price} RSD</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ISOs Tab */}
      {!loading && tab === 'isos' && (
        <div>
          {isos.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl shadow">
              <p className="text-gray-500 mb-4">{t('noISOsYet')}</p>
              <Link
                to="/iso/new"
                className="inline-block px-4 py-2 rounded-2xl bg-black text-white"
              >
                {t('ctaCreateISO')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {isos.map((iso) => (
                <div
                  key={iso.id}
                  className="rounded-2xl shadow bg-white p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium">{iso.title}</div>
                    {iso.description && (
                      <div className="text-sm text-gray-600 mt-1">{iso.description}</div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {iso.budget && <span className="mr-3">💰 {iso.budget} RSD</span>}
                      {iso.age && <span className="mr-3">👶 {iso.age}</span>}
                      {iso.size && <span className="mr-3">📏 {iso.size}</span>}
                      {iso.district && <span>📍 {iso.district}</span>}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div
                      className={`text-sm font-medium ${
                        iso.daysLeft && iso.daysLeft > 3 ? 'text-green-600' : 'text-orange-600'
                      }`}
                    >
                      ⏳ {iso.daysLeft}d {t('left')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(iso.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
