import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { isoApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function ISOCreate(){
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    age: '',
    size: '',
    district: '',
    daysValid: '7',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to create an ISO request');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await isoApi.create({
        title: formData.title,
        description: formData.description || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        age: formData.age || undefined,
        size: formData.size || undefined,
        district: formData.district || undefined,
        daysValid: Number(formData.daysValid),
      });

      // Redirect to home after successful creation
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create ISO request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">{t('isoCreateTitle')}</h2>

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
          placeholder={t('formBudget')!}
          type="number"
          className="w-full border rounded p-2"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
        />
        <input
          placeholder={t('formDaysValid')!}
          type="number"
          min="1"
          max="30"
          className="w-full border rounded p-2"
          value={formData.daysValid}
          onChange={(e) => setFormData({ ...formData, daysValid: e.target.value })}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : t('submit')}
        </button>
      </form>
    </div>
  );
}
