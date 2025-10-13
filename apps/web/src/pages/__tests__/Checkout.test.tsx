import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Checkout from '../Checkout';
import * as api from '../../lib/api';
import * as authStore from '../../store/authStore';

// Mock modules
vi.mock('../../lib/api');
vi.mock('../../store/authStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ listingId: 'listing-123' }),
    useNavigate: () => vi.fn(),
  };
});

describe('Checkout Component', () => {
  const mockUser = {
    id: 'user-123',
    email: 'buyer@example.com',
    name: 'John Doe',
    phone: '+381123456789',
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  const mockListing = {
    id: 'listing-123',
    title: 'Test Product',
    description: 'A great product',
    price: 5000,
    district: 'Stari Grad',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    userId: 'seller-456',
    user: { id: 'seller-456', name: 'Seller User' },
    photos: [
      {
        id: 'photo-1',
        url: 'https://example.com/photo.jpg',
        createdAt: '2024-01-01T00:00:00.000Z',
        listingId: 'listing-123',
      },
    ],
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

  it('should render checkout form with listing details', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Оформление заказа')).toBeInTheDocument();
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('5000 RSD')).toBeInTheDocument();
    });
  });

  it('should pre-fill buyer information from user data', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/имя/i) as HTMLInputElement;
      const phoneInput = screen.getByLabelText(/телефон/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;

      expect(nameInput.value).toBe('John Doe');
      expect(phoneInput.value).toBe('+381123456789');
      expect(emailInput.value).toBe('buyer@example.com');
    });
  });

  it('should show error if user tries to buy their own listing', async () => {
    const ownListing = { ...mockListing, userId: mockUser.id };
    vi.mocked(api.listingsApi.getById).mockResolvedValue(ownListing);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/не можете купить своё собственное объявление/i)
      ).toBeInTheDocument();
    });
  });

  it('should display all payment method options', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Банковская карта')).toBeInTheDocument();
      expect(screen.getByText('Наличные при получении')).toBeInTheDocument();
      expect(screen.getByText('Банковский перевод')).toBeInTheDocument();
    });
  });

  it('should show card number input when CARD payment is selected', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      const cardInput = screen.getByLabelText(/номер карты/i);
      expect(cardInput).toBeInTheDocument();
    });
  });

  it('should hide card number input when CASH payment is selected', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Банковская карта')).toBeInTheDocument();
    });

    const cashRadio = screen.getByLabelText(/наличные при получении/i);
    await user.click(cashRadio);

    expect(screen.queryByLabelText(/номер карты/i)).not.toBeInTheDocument();
  });

  it('should validate required fields before submission', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
    });

    // Clear required fields
    const nameInput = screen.getByLabelText(/имя/i);
    await user.clear(nameInput);

    const submitButton = screen.getByText('Оформить заказ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/пожалуйста, введите ваше имя/i)).toBeInTheDocument();
    });
  });

  it('should submit order with card number', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    vi.mocked(api.ordersApi.create).mockResolvedValue({
      id: 'order-123',
      totalAmount: 5000,
      status: 'PENDING',
      buyerName: 'John Doe',
      buyerPhone: '+381123456789',
      buyerEmail: 'buyer@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    } as any);

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/номер карты/i)).toBeInTheDocument();
    });

    const cardInput = screen.getByLabelText(/номер карты/i);
    await user.type(cardInput, '1234567890123456');

    const submitButton = screen.getByText('Оформить заказ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(api.ordersApi.create).toHaveBeenCalledWith(
        expect.objectContaining({
          listingId: 'listing-123',
          buyerName: 'John Doe',
          payment: expect.objectContaining({
            method: 'CARD',
            cardNumber: '1234567890123456',
          }),
        })
      );
    });
  });

  it('should show success message after order creation', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    vi.mocked(api.ordersApi.create).mockResolvedValue({} as any);

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
    });

    const cardInput = screen.getByLabelText(/номер карты/i);
    await user.type(cardInput, '1234567890123456');

    const submitButton = screen.getByText('Оформить заказ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/заказ успешно создан/i)).toBeInTheDocument();
    });
  });

  it('should format card number input (remove non-digits)', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/номер карты/i)).toBeInTheDocument();
    });

    const cardInput = screen.getByLabelText(/номер карты/i) as HTMLInputElement;
    await user.type(cardInput, 'abcd1234-5678-9012-3456xyz');

    expect(cardInput.value).toBe('1234567890123456');
  });

  it('should limit card number to 16 digits', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/номер карты/i)).toBeInTheDocument();
    });

    const cardInput = screen.getByLabelText(/номер карты/i) as HTMLInputElement;
    expect(cardInput).toHaveAttribute('maxLength', '16');
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(api.listingsApi.getById).mockResolvedValue(mockListing);
    vi.mocked(api.ordersApi.create).mockRejectedValue({
      response: { data: { error: 'Payment processing failed' } },
    });

    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
    });

    const cardInput = screen.getByLabelText(/номер карты/i);
    await user.type(cardInput, '1234567890123456');

    const submitButton = screen.getByText('Оформить заказ');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/payment processing failed/i)).toBeInTheDocument();
    });
  });
});
