import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listingsApi, ordersApi, Listing } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Checkout() {
  const { listingId } = useParams<{ listingId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form state
  const [buyerName, setBuyerName] = useState(user?.name || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDistrict, setDeliveryDistrict] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'BANK_TRANSFER'>('CARD');
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchListing = async () => {
      if (!listingId) {
        navigate('/');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await listingsApi.getById(listingId);
        setListing(data);

        // Can't buy your own listing
        if (data.userId === user.id) {
          setError('Вы не можете купить своё собственное объявление');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listing) return;

    // Validation
    if (!buyerName.trim()) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    if (!buyerPhone.trim()) {
      setError('Пожалуйста, введите ваш телефон');
      return;
    }

    if (paymentMethod === 'CARD' && !cardNumber.trim()) {
      setError('Пожалуйста, введите номер карты');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const orderData = {
        listingId: listing.id,
        buyerName,
        buyerPhone,
        buyerEmail: buyerEmail || undefined,
        deliveryAddress: deliveryAddress || undefined,
        deliveryDistrict: deliveryDistrict || undefined,
        notes: notes || undefined,
        payment: {
          method: paymentMethod,
          cardNumber: paymentMethod === 'CARD' ? cardNumber : undefined,
        },
      };

      await ordersApi.create(orderData);
      setSuccess(true);

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
        <Link to="/" className="text-blue-600 underline">
          ← Назад на главную
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2 text-green-600">Заказ успешно создан!</h2>
          <p className="text-gray-600 mb-6">
            Продавец свяжется с вами в ближайшее время
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 rounded-2xl bg-black text-white hover:bg-gray-800"
          >
            Посмотреть мои заказы
          </Link>
        </div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  const photoUrl = listing.photos[0]?.url || 'https://picsum.photos/seed/default/200/200';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to={`/listing/${listing.id}`} className="text-blue-600 underline mb-4 inline-block">
        ← Назад к объявлению
      </Link>

      <h1 className="text-3xl font-bold mb-6">Оформление заказа</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Ваш заказ</h2>

            <div className="flex gap-4 mb-4">
              <img
                src={photoUrl}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-600">{listing.district}</p>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Цена товара:</span>
                <span className="font-medium">{listing.price} RSD</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Итого:</span>
                <span className="text-green-600">{listing.price} RSD</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-2">Продавец</h3>
              <p className="text-sm">{listing.user.name}</p>
              {listing.user.phone && (
                <p className="text-sm text-gray-600">📞 {listing.user.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
            {error && listing && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Buyer Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Ваши данные</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email (опционально)
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Доставка</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Адрес доставки (опционально)
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Улица, дом, квартира"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Район (опционально)
                  </label>
                  <input
                    type="text"
                    value={deliveryDistrict}
                    onChange={(e) => setDeliveryDistrict(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Комментарий к заказу (опционально)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Дополнительная информация для продавца"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Способ оплаты</h2>

              <div className="space-y-3 mb-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <span className="font-medium">Банковская карта</span>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === 'CASH'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <span className="font-medium">Наличные при получении</span>
                </label>

                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="mr-3"
                  />
                  <span className="font-medium">Банковский перевод</span>
                </label>
              </div>

              {paymentMethod === 'CARD' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Номер карты <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    required={paymentMethod === 'CARD'}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Введите 16 цифр без пробелов
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ Демо режим: В продакшене используйте платёжный шлюз (Stripe, PayPal)
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Оформление...' : 'Оформить заказ'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями использования
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
