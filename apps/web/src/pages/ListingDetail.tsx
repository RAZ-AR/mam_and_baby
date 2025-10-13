import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listingsApi, Listing } from '../lib/api';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await listingsApi.getById(id);
        setListing(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, navigate]);

  const nextPhoto = () => {
    if (listing && listing.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev + 1) % listing.photos.length);
    }
  };

  const prevPhoto = () => {
    if (listing && listing.photos.length > 0) {
      setCurrentPhotoIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error || 'Listing not found'}
        </div>
        <Link to="/" className="text-blue-600 underline">
          ← {t('backToHome')}
        </Link>
      </div>
    );
  }

  const currentPhoto = listing.photos[currentPhotoIndex];
  const hasPhotos = listing.photos.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/" className="text-blue-600 underline mb-4 inline-block">
        ← {t('backToHome')}
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Photo Gallery */}
        {hasPhotos ? (
          <div className="relative bg-gray-100">
            <img
              src={currentPhoto?.url || 'https://picsum.photos/seed/default/800/600'}
              alt={listing.title}
              className="w-full h-96 object-contain"
            />

            {/* Photo Navigation */}
            {listing.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                >
                  ←
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
                >
                  →
                </button>

                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-gray-200 h-96 flex items-center justify-center">
            <span className="text-gray-500">{t('noPhotos')}</span>
          </div>
        )}

        {/* Listing Details */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <p className="text-2xl font-bold text-green-600">{listing.price} RSD</p>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('formDescription')}</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {listing.age && (
              <div>
                <span className="text-sm text-gray-600">{t('formAge')}</span>
                <p className="font-medium">{listing.age}</p>
              </div>
            )}
            {listing.size && (
              <div>
                <span className="text-sm text-gray-600">{t('formSize')}</span>
                <p className="font-medium">{listing.size}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-600">{t('formDistricts')}</span>
              <p className="font-medium">{listing.district}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">{t('posted')}</span>
              <p className="font-medium">{new Date(listing.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">{t('sellerInfo')}</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg">{listing.user.name}</p>
                {listing.user.phone && (
                  <p className="text-gray-600">📞 {listing.user.phone}</p>
                )}
                {listing.user.email && (
                  <p className="text-gray-600">✉️ {listing.user.email}</p>
                )}
              </div>
              <Link
                to={`/checkout/${listing.id}`}
                className="px-6 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 inline-block text-center"
              >
                {t('buyNow') || 'Купить сейчас'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
