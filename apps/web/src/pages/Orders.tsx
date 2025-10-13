import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ordersApi, Order } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Orders() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const [purchasesData, salesData] = await Promise.all([
          ordersApi.getMyPurchases(),
          ordersApi.getMySales(),
        ]);
        setPurchases(purchasesData);
        setSales(salesData);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_DELIVERY':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'PENDING':
        return 'Ожидает';
      case 'CONFIRMED':
        return 'Подтверждён';
      case 'IN_DELIVERY':
        return 'В доставке';
      case 'COMPLETED':
        return 'Завершён';
      case 'CANCELLED':
        return 'Отменён';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'CARD':
        return 'Карта';
      case 'CASH':
        return 'Наличные';
      case 'BANK_TRANSFER':
        return 'Перевод';
      default:
        return method;
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      // Refresh sales data
      const salesData = await ordersApi.getMySales();
      setSales(salesData);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order status');
    }
  };

  const renderOrders = (orders: Order[], isSeller: boolean) => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">
            {isSeller ? 'У вас пока нет продаж' : 'У вас пока нет покупок'}
          </p>
          <Link to="/" className="text-blue-600 underline">
            Перейти к объявлениям
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => {
          const otherParty = isSeller ? order.buyer : order.seller;
          const photoUrl = order.listing.photos[0]?.url || 'https://picsum.photos/seed/default/100/100';

          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex gap-4">
                {/* Product Image */}
                <Link to={`/listing/${order.listing.id}`}>
                  <img
                    src={photoUrl}
                    alt={order.listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>

                {/* Order Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/listing/${order.listing.id}`}
                        className="text-lg font-semibold hover:text-blue-600"
                      >
                        {order.listing.title}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Заказ от {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Price and Payment */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-green-600">{order.totalAmount} RSD</p>
                    {order.payment && (
                      <p className="text-sm text-gray-600">
                        Оплата: {getPaymentMethodText(order.payment.method)}
                        {order.payment.cardLastFour && ` •••• ${order.payment.cardLastFour}`}
                      </p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      {isSeller ? 'Покупатель:' : 'Продавец:'}
                    </p>
                    <p className="text-sm">{isSeller ? order.buyerName : otherParty.name}</p>
                    <p className="text-sm text-gray-600">
                      📞 {isSeller ? order.buyerPhone : otherParty.phone}
                    </p>
                    {order.buyerEmail && isSeller && (
                      <p className="text-sm text-gray-600">✉️ {order.buyerEmail}</p>
                    )}
                  </div>

                  {/* Delivery Info */}
                  {(order.deliveryAddress || order.deliveryDistrict || order.notes) && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">Доставка:</p>
                      {order.deliveryAddress && (
                        <p className="text-sm">{order.deliveryAddress}</p>
                      )}
                      {order.deliveryDistrict && (
                        <p className="text-sm text-gray-600">{order.deliveryDistrict}</p>
                      )}
                      {order.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          Комментарий: {order.notes}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Seller Actions */}
                  {isSeller && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <div className="flex gap-2 mt-3">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
                        >
                          Подтвердить
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'IN_DELIVERY')}
                          className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
                        >
                          Отправлено
                        </button>
                      )}
                      {order.status === 'IN_DELIVERY' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700"
                        >
                          Завершить
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                        className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm hover:bg-red-200"
                      >
                        Отменить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`pb-3 px-4 font-medium ${
            activeTab === 'purchases'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Мои покупки ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 px-4 font-medium ${
            activeTab === 'sales'
              ? 'border-b-2 border-black text-black'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Мои продажи ({sales.length})
        </button>
      </div>

      {/* Orders List */}
      {activeTab === 'purchases' ? renderOrders(purchases, false) : renderOrders(sales, true)}
    </div>
  );
}
