import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { listingsApi, uploadApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function ListingCreate(){
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    age: '',
    size: '',
    district: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Limit to 5 photos total
    if (photos.length + newFiles.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    // Validate file sizes (max 5MB each)
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each photo must be less than 5MB');
        return;
      }
    }

    setPhotos([...photos, ...newFiles]);

    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError('');
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to create a listing');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, create the listing
      const listing = await listingsApi.create({
        title: formData.title,
        description: formData.description || undefined,
        price: Number(formData.price),
        age: formData.age || undefined,
        size: formData.size || undefined,
        district: formData.district,
      });

      // Then upload photos if any
      if (photos.length > 0) {
        setUploadingPhotos(true);
        await uploadApi.uploadListingPhotos(listing.id, photos);
      }

      // Redirect to home after successful creation
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
      setUploadingPhotos(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('listingCreateTitle')}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder={t('formTitle')!}
          className="w-full border rounded p-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          placeholder={t('formDescription')!}
          className="w-full border rounded p-2 h-28"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          placeholder="Price (RSD)"
          type="number"
          className="w-full border rounded p-2"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          placeholder={t('formAge')!}
          className="w-full border rounded p-2"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        <input
          placeholder={t('formSize')!}
          className="w-full border rounded p-2"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
        />
        <input
          placeholder={t('formDistricts')!}
          className="w-full border rounded p-2"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          required
        />

        {/* Photo Upload Section */}
        <div className="border rounded p-3 bg-gray-50">
          <label className="block text-sm font-medium mb-2">
            {t('formPhotos')} ({photos.length}/5)
          </label>

          {/* Photo Previews */}
          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {photos.length < 5 && (
            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-100">
                <span className="text-gray-600">
                  {t('uploadPhotosHint')}
                </span>
              </div>
            </label>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50"
          disabled={loading || uploadingPhotos}
        >
          {uploadingPhotos ? t('uploadingPhotos') : loading ? 'Creating...' : t('submit')}
        </button>
      </form>
    </div>
  );
}
