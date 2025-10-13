import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const createOrderSchema = z.object({
  listingId: z.string().uuid(),
  buyerName: z.string().min(1),
  buyerPhone: z.string().min(5),
  buyerEmail: z.string().email().optional(),
  deliveryAddress: z.string().optional(),
  deliveryDistrict: z.string().optional(),
  notes: z.string().optional(),
  payment: z.object({
    method: z.enum(['CARD', 'CASH', 'BANK_TRANSFER']),
    cardNumber: z.string().optional(),
  }),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_DELIVERY', 'COMPLETED', 'CANCELLED']),
});

// Create a new order
router.post('/', authenticate, async (req, res) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.user!.userId;

    // Get listing details
    const listing = await prisma.listing.findUnique({
      where: { id: data.listingId },
      include: { user: true },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Can't buy your own listing
    if (listing.userId === userId) {
      return res.status(400).json({ error: 'Cannot purchase your own listing' });
    }

    // Extract last 4 digits from card number if provided
    const cardLastFour = data.payment.cardNumber
      ? data.payment.cardNumber.slice(-4)
      : undefined;

    // Create order with payment
    const order = await prisma.order.create({
      data: {
        totalAmount: listing.price,
        buyerId: userId,
        sellerId: listing.userId,
        listingId: data.listingId,
        buyerName: data.buyerName,
        buyerPhone: data.buyerPhone,
        buyerEmail: data.buyerEmail,
        deliveryAddress: data.deliveryAddress,
        deliveryDistrict: data.deliveryDistrict,
        notes: data.notes,
        payment: {
          create: {
            amount: listing.price,
            method: data.payment.method,
            cardNumber: data.payment.cardNumber, // В продакшене не сохранять!
            cardLastFour,
          },
        },
      },
      include: {
        payment: true,
        listing: {
          include: {
            photos: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get user's orders (as buyer)
router.get('/my-purchases', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      include: {
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            cardLastFour: true,
            createdAt: true,
            paidAt: true,
          },
        },
        listing: {
          include: {
            photos: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get user's orders (as seller)
router.get('/my-sales', authenticate, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const orders = await prisma.order.findMany({
      where: { sellerId: userId },
      include: {
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            cardLastFour: true,
            createdAt: true,
            paidAt: true,
          },
        },
        listing: {
          include: {
            photos: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user!.userId;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        listing: {
          include: {
            photos: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only buyer or seller can view order
    if (order.buyerId !== userId && order.sellerId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (seller only)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user!.userId;
    const data = updateOrderStatusSchema.parse(req.body);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only seller can update status
    if (order.sellerId !== userId) {
      return res.status(403).json({ error: 'Only seller can update order status' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: data.status,
        completedAt: data.status === 'COMPLETED' ? new Date() : undefined,
      },
      include: {
        payment: true,
        listing: {
          include: {
            photos: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status (for admin/payment gateway webhook)
router.patch('/:id/payment-status', authenticate, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user!.userId;
    const { status, transactionId } = req.body;

    if (!['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only seller can update payment status
    if (order.sellerId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: order.payment!.id },
      data: {
        status,
        transactionId,
        paidAt: status === 'COMPLETED' ? new Date() : undefined,
      },
    });

    res.json(updatedPayment);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

export default router;
