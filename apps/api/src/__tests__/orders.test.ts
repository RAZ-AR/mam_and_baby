import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

// Mock Prisma
const mockPrismaOrder = {
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
};

const mockPrismaListing = {
  findUnique: jest.fn(),
};

const mockPrismaPayment = {
  update: jest.fn(),
};

jest.unstable_mockModule('../lib/prisma', () => ({
  default: {
    order: mockPrismaOrder,
    listing: mockPrismaListing,
    payment: mockPrismaPayment,
  },
}));

// Import after mocking
const { default: ordersRouter } = await import('../routes/orders.js');

describe('Orders API', () => {
  let app: express.Application;

  // Mock user authentication middleware
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    app.use((req: any, res, next) => {
      req.user = mockUser;
      next();
    });

    app.use('/orders', ordersRouter);

    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    const validOrderData = {
      listingId: 'listing-123',
      buyerName: 'John Doe',
      buyerPhone: '+381123456789',
      buyerEmail: 'john@example.com',
      deliveryAddress: '123 Main St',
      deliveryDistrict: 'Stari Grad',
      notes: 'Please call before delivery',
      payment: {
        method: 'CARD',
        cardNumber: '1234567890123456',
      },
    };

    const mockListing = {
      id: 'listing-123',
      title: 'Test Item',
      price: 5000,
      userId: 'seller-456',
      user: {
        id: 'seller-456',
        name: 'Seller User',
        email: 'seller@example.com',
        phone: '+381987654321',
      },
    };

    const mockCreatedOrder = {
      id: 'order-123',
      totalAmount: 5000,
      status: 'PENDING',
      buyerId: mockUser.id,
      sellerId: 'seller-456',
      listingId: 'listing-123',
      buyerName: 'John Doe',
      buyerPhone: '+381123456789',
      buyerEmail: 'john@example.com',
      deliveryAddress: '123 Main St',
      deliveryDistrict: 'Stari Grad',
      notes: 'Please call before delivery',
      createdAt: new Date(),
      updatedAt: new Date(),
      payment: {
        id: 'payment-123',
        amount: 5000,
        method: 'CARD',
        status: 'PENDING',
        cardNumber: '1234567890123456',
        cardLastFour: '3456',
        createdAt: new Date(),
      },
      listing: {
        ...mockListing,
        photos: [],
      },
      buyer: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        phone: '+381111111111',
      },
      seller: {
        id: 'seller-456',
        name: 'Seller User',
        email: 'seller@example.com',
        phone: '+381987654321',
      },
    };

    it('should create a new order successfully', async () => {
      mockPrismaListing.findUnique.mockResolvedValue(mockListing);
      mockPrismaOrder.create.mockResolvedValue(mockCreatedOrder);

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.totalAmount).toBe(5000);
      expect(response.body.buyerName).toBe('John Doe');
      expect(response.body.payment.cardNumber).toBe('1234567890123456');
      expect(response.body.payment.cardLastFour).toBe('3456');
      expect(mockPrismaListing.findUnique).toHaveBeenCalledWith({
        where: { id: 'listing-123' },
        include: { user: true },
      });
    });

    it('should reject order if listing not found', async () => {
      mockPrismaListing.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Listing not found');
      expect(mockPrismaOrder.create).not.toHaveBeenCalled();
    });

    it('should reject order if user tries to buy their own listing', async () => {
      const ownListing = {
        ...mockListing,
        userId: mockUser.id,
      };
      mockPrismaListing.findUnique.mockResolvedValue(ownListing);

      const response = await request(app)
        .post('/orders')
        .send(validOrderData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Cannot purchase your own listing');
      expect(mockPrismaOrder.create).not.toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        listingId: 'listing-123',
        // Missing buyerName and buyerPhone
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should extract last 4 digits from card number', async () => {
      mockPrismaListing.findUnique.mockResolvedValue(mockListing);
      mockPrismaOrder.create.mockResolvedValue(mockCreatedOrder);

      await request(app).post('/orders').send(validOrderData).expect(201);

      const createCall = mockPrismaOrder.create.mock.calls[0][0];
      expect(createCall.data.payment.create.cardLastFour).toBe('3456');
      expect(createCall.data.payment.create.cardNumber).toBe('1234567890123456');
    });

    it('should handle cash payment method without card number', async () => {
      mockPrismaListing.findUnique.mockResolvedValue(mockListing);
      const cashOrder = {
        ...validOrderData,
        payment: {
          method: 'CASH',
        },
      };

      const cashOrderResult = {
        ...mockCreatedOrder,
        payment: {
          ...mockCreatedOrder.payment,
          method: 'CASH',
          cardNumber: null,
          cardLastFour: null,
        },
      };

      mockPrismaOrder.create.mockResolvedValue(cashOrderResult);

      const response = await request(app)
        .post('/orders')
        .send(cashOrder)
        .expect(201);

      expect(response.body.payment.method).toBe('CASH');
      expect(response.body.payment.cardNumber).toBeNull();
    });
  });

  describe('GET /orders/my-purchases', () => {
    it('should return user purchases', async () => {
      const mockPurchases = [
        {
          id: 'order-1',
          totalAmount: 5000,
          status: 'COMPLETED',
          buyerId: mockUser.id,
          payment: {
            id: 'payment-1',
            amount: 5000,
            method: 'CARD',
            status: 'COMPLETED',
            cardLastFour: '3456',
          },
          listing: {
            id: 'listing-1',
            title: 'Test Item',
            photos: [],
          },
          seller: {
            id: 'seller-1',
            name: 'Seller',
            email: 'seller@example.com',
            phone: '+381111111111',
          },
        },
      ];

      mockPrismaOrder.findMany.mockResolvedValue(mockPurchases);

      const response = await request(app).get('/orders/my-purchases').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe('order-1');
      expect(mockPrismaOrder.findMany).toHaveBeenCalledWith({
        where: { buyerId: mockUser.id },
        include: expect.any(Object),
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('GET /orders/my-sales', () => {
    it('should return user sales', async () => {
      const mockSales = [
        {
          id: 'order-2',
          totalAmount: 3000,
          status: 'PENDING',
          sellerId: mockUser.id,
          payment: {
            id: 'payment-2',
            amount: 3000,
            method: 'CASH',
            status: 'PENDING',
          },
          listing: {
            id: 'listing-2',
            title: 'Another Item',
            photos: [],
          },
          buyer: {
            id: 'buyer-1',
            name: 'Buyer',
            email: 'buyer@example.com',
            phone: '+381222222222',
          },
        },
      ];

      mockPrismaOrder.findMany.mockResolvedValue(mockSales);

      const response = await request(app).get('/orders/my-sales').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].sellerId).toBe(mockUser.id);
    });
  });

  describe('GET /orders/:id', () => {
    const mockOrder = {
      id: 'order-123',
      buyerId: mockUser.id,
      sellerId: 'seller-456',
      totalAmount: 5000,
      payment: {},
      listing: { photos: [] },
      buyer: {},
      seller: {},
    };

    it('should return order details for buyer', async () => {
      mockPrismaOrder.findUnique.mockResolvedValue(mockOrder);

      const response = await request(app).get('/orders/order-123').expect(200);

      expect(response.body.id).toBe('order-123');
    });

    it('should return order details for seller', async () => {
      const sellerOrder = { ...mockOrder, buyerId: 'other-buyer', sellerId: mockUser.id };
      mockPrismaOrder.findUnique.mockResolvedValue(sellerOrder);

      const response = await request(app).get('/orders/order-123').expect(200);

      expect(response.body.id).toBe('order-123');
    });

    it('should return 404 if order not found', async () => {
      mockPrismaOrder.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/orders/nonexistent').expect(404);

      expect(response.body).toHaveProperty('error', 'Order not found');
    });

    it('should return 403 if user is neither buyer nor seller', async () => {
      const otherOrder = {
        ...mockOrder,
        buyerId: 'other-buyer',
        sellerId: 'other-seller',
      };
      mockPrismaOrder.findUnique.mockResolvedValue(otherOrder);

      const response = await request(app).get('/orders/order-123').expect(403);

      expect(response.body).toHaveProperty('error', 'Access denied');
    });
  });

  describe('PATCH /orders/:id/status', () => {
    const mockOrder = {
      id: 'order-123',
      sellerId: mockUser.id,
      buyerId: 'buyer-456',
      status: 'PENDING',
    };

    it('should update order status as seller', async () => {
      mockPrismaOrder.findUnique.mockResolvedValue(mockOrder);
      const updatedOrder = {
        ...mockOrder,
        status: 'CONFIRMED',
        payment: {},
        listing: { photos: [] },
        buyer: {},
        seller: {},
      };
      mockPrismaOrder.update.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .patch('/orders/order-123/status')
        .send({ status: 'CONFIRMED' })
        .expect(200);

      expect(response.body.status).toBe('CONFIRMED');
    });

    it('should reject if user is not the seller', async () => {
      const otherOrder = { ...mockOrder, sellerId: 'other-seller' };
      mockPrismaOrder.findUnique.mockResolvedValue(otherOrder);

      const response = await request(app)
        .patch('/orders/order-123/status')
        .send({ status: 'CONFIRMED' })
        .expect(403);

      expect(response.body).toHaveProperty('error', 'Only seller can update order status');
    });

    it('should set completedAt when status is COMPLETED', async () => {
      mockPrismaOrder.findUnique.mockResolvedValue(mockOrder);
      mockPrismaOrder.update.mockResolvedValue({
        ...mockOrder,
        status: 'COMPLETED',
        completedAt: new Date(),
        payment: {},
        listing: { photos: [] },
        buyer: {},
        seller: {},
      });

      await request(app)
        .patch('/orders/order-123/status')
        .send({ status: 'COMPLETED' })
        .expect(200);

      const updateCall = mockPrismaOrder.update.mock.calls[0][0];
      expect(updateCall.data.status).toBe('COMPLETED');
      expect(updateCall.data.completedAt).toBeInstanceOf(Date);
    });
  });
});
