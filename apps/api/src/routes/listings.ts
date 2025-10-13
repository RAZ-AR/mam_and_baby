import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
export const router = Router();

const CreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  age: z.string().optional(),
  size: z.string().optional(),
  district: z.string().min(2),
});

// GET /listings - List all listings with optional filters
router.get('/', async (req,res)=> {
  try {
    const { search, district, minPrice, maxPrice, age, size } = req.query;

    // Build where clause dynamically
    const where: any = {};

    // Text search in title and description
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // District filter
    if (district && typeof district === 'string') {
      where.district = { contains: district, mode: 'insensitive' };
    }

    // Price range filter
    if (minPrice && typeof minPrice === 'string') {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }
    if (maxPrice && typeof maxPrice === 'string') {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    // Age filter
    if (age && typeof age === 'string') {
      where.age = { contains: age, mode: 'insensitive' };
    }

    // Size filter
    if (size && typeof size === 'string') {
      where.size = { contains: size, mode: 'insensitive' };
    }

    const listings = await prisma.listing.findMany({
      where,
      include: { photos: true, user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /listings/:id - Get single listing by ID
router.get('/:id', async (req,res)=> {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: req.params.id },
      include: {
        photos: true,
        user: { select: { id: true, name: true, email: true, phone: true } }
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// GET /listings/user/me - Get current user's listings (requires authentication)
router.get('/user/me', authenticate, async (req,res)=> {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.userId },
      include: { photos: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});

// POST /listings - Create new listing (requires authentication)
router.post('/', authenticate, async (req,res)=>{
  try {
    const parse = CreateSchema.safeParse(req.body);
    if(!parse.success) return res.status(400).json(parse.error.flatten());

    const listing = await prisma.listing.create({
      data: {
        ...parse.data,
        userId: req.user!.userId,
      },
      include: { photos: true },
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
});
