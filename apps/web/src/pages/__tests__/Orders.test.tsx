import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Orders from '../Orders';
import * as api from '../../lib/api';
import * as authStore from '../../store/authStore';

// Mock modules
vi.mock('../../lib/api');
vi.mock('../../store/authStore');

describe('Orders Component', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    phone: '+381123456789',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockPurchase = {
    id: 'order-1',
    totalAmount: 5000,
    status: 'COMPLETED',
    buyerName: 'Test User',
    buyerPhone: '+381123456789',
    buyerEmail: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    buyerId: 'user-123',
    sellerId: 'seller-456',
    listingId: 'listing-1',
    payment: {
      id: 'payment-1',
      amount: 5000,
      method: 'CARD',
      status: 'COMPLETED',
      cardLastFour: '3456',
      createdAt: '2024-01-01T00:00:00.000Z',
      orderId: 'order-1',
    },
    listing: {
      id: 'listing-1',
      title: 'Test Product',
      description: 'Great product',
      price: 5000,
      district: 'Stari Grad',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      userId: 'seller-456',
      user: { id: 'seller-456', name: 'Seller' },
      photos: [],
    },
    buyer: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+381123456789',
    },
    seller: {
      id: 'seller-456',
      name: 'Seller User',
      email: 'seller@example.com',
      phone: '+381987654321',
    },
  };

  const mockSale = {
    id: 'order-2',
    totalAmount: 3000,
    status: 'PENDING',
    buyerName: 'Buyer User',
    buyerPhone: '+381111111111',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    buyerId: 'buyer-789',
    sellerId: 'user-123',
    listingId: 'listing-2',
    payment: {
      id: 'payment-2',
      amount: 3000,
      method: 'CASH',
      status: 'PENDING',
      createdAt: '2024-01-01T00:00:00.000Z',
      orderId: 'order-2',
    },
    listing: {
      id: 'listing-2',
      title: 'Another Product',
      price: 3000,
      district: 'Novi Beograd',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      userId: 'user-123',
      user: { id: 'user-123', name: 'Test User' },
      photos: [],
    },
    buyer: {
      id: 'buyer-789',
      name: 'Buyer User',
      email: 'buyer@example.com',
      phone: '+381111111111',
    },
    seller: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      phone: '+381123456789',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authStore.useAuthStore).mockReturnValue({
      user: mockUser,
      fetchUser: vi.fn(),
      logout: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
    } as any);
  });

  it('should render orders page with tabs', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([mockPurchase] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([mockSale] as any);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Мои заказы')).toBeInTheDocument();
      expect(screen.getByText(/Мои покупки/)).toBeInTheDocument();
      expect(screen.getByText(/Мои продажи/)).toBeInTheDocument();
    });
  });

  it('should display purchases in purchases tab', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([mockPurchase] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('5000 RSD')).toBeInTheDocument();
      expect(screen.getByText(/Завершён/)).toBeInTheDocument();
    });
  });

  it('should display sales in sales tab', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([mockSale] as any);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Мои продажи/)).toBeInTheDocument();
    });

    const salesTab = screen.getByText(/Мои продажи/);
    await user.click(salesTab);

    await waitFor(() => {
      expect(screen.getByText('Another Product')).toBeInTheDocument();
      expect(screen.getByText('3000 RSD')).toBeInTheDocument();
    });
  });

  it('should display card last 4 digits for card payments', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([mockPurchase] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/•••• 3456/)).toBeInTheDocument();
    });
  });

  it('should show correct status colors', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([mockPurchase] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      const statusBadge = screen.getByText(/Завершён/);
      expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
    });
  });

  it('should show empty state when no purchases', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/У вас пока нет покупок/)).toBeInTheDocument();
    });
  });

  it('should show empty state when no sales', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Мои продажи/)).toBeInTheDocument();
    });

    const salesTab = screen.getByText(/Мои продажи/);
    await user.click(salesTab);

    await waitFor(() => {
      expect(screen.getByText(/У вас пока нет продаж/)).toBeInTheDocument();
    });
  });

  it('should show seller action buttons for pending sale', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([mockSale] as any);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    const salesTab = screen.getByText(/Мои продажи/);
    await user.click(salesTab);

    await waitFor(() => {
      expect(screen.getByText('Подтвердить')).toBeInTheDocument();
      expect(screen.getByText('Отменить')).toBeInTheDocument();
    });
  });

  it('should update order status when confirm button clicked', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([mockSale] as any);
    vi.mocked(api.ordersApi.updateStatus).mockResolvedValue({
      ...mockSale,
      status: 'CONFIRMED',
    } as any);

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    const salesTab = screen.getByText(/Мои продажи/);
    await user.click(salesTab);

    await waitFor(() => {
      expect(screen.getByText('Подтвердить')).toBeInTheDocument();
    });

    const confirmButton = screen.getByText('Подтвердить');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(api.ordersApi.updateStatus).toHaveBeenCalledWith('order-2', 'CONFIRMED');
    });
  });

  it('should display buyer information in sales', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([]);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([mockSale] as any);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    const salesTab = screen.getByText(/Мои продажи/);
    await user.click(salesTab);

    await waitFor(() => {
      expect(screen.getByText('Buyer User')).toBeInTheDocument();
      expect(screen.getByText(/📞.*\+381111111111/)).toBeInTheDocument();
    });
  });

  it('should display seller information in purchases', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([mockPurchase] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Seller User')).toBeInTheDocument();
      expect(screen.getByText(/📞.*\+381987654321/)).toBeInTheDocument();
    });
  });

  it('should display delivery information if provided', async () => {
    const orderWithDelivery = {
      ...mockPurchase,
      deliveryAddress: '123 Main St',
      deliveryDistrict: 'Stari Grad',
      notes: 'Please call before delivery',
    };

    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([orderWithDelivery] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
      expect(screen.getByText(/Please call before delivery/)).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(api.ordersApi.getMyPurchases).mockRejectedValue({
      response: { data: { error: 'Failed to fetch orders' } },
    });
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch orders/)).toBeInTheDocument();
    });
  });

  it('should show payment method text correctly', async () => {
    const cashOrder = { ...mockPurchase, payment: { ...mockPurchase.payment, method: 'CASH' } };
    vi.mocked(api.ordersApi.getMyPurchases).mockResolvedValue([cashOrder] as any);
    vi.mocked(api.ordersApi.getMySales).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Orders />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Оплата:.*Наличные/)).toBeInTheDocument();
    });
  });
});
