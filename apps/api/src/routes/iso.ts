import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
export const router = Router();

const CreateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  budget: z.number().nonnegative().optional(),
  age: z.string().optional(),
  size: z.string().optional(),
  district: z.string().optional(),
  daysValid: z.number().int().min(1).max(30).default(7),
});

// GET /iso/feed - List all ISO requests
router.get('/feed', async (_,res)=> {
  try {
    const isos = await prisma.iSO.findMany({
      where: { expiresAt: { gt: new Date() } }, // Only active ISOs
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate daysLeft for each ISO
    const isosWithDaysLeft = isos.map(iso => ({
      ...iso,
      daysLeft: Math.ceil((iso.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }));

    res.json(isosWithDaysLeft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ISOs' });
  }
});

// GET /iso/user/me - Get current user's ISO requests (requires authentication)
router.get('/user/me', authenticate, async (req,res)=> {
  try {
    const isos = await prisma.iSO.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate daysLeft for each ISO
    const isosWithDaysLeft = isos.map(iso => ({
      ...iso,
      daysLeft: Math.ceil((iso.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    }));

    res.json(isosWithDaysLeft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user ISOs' });
  }
});

// POST /iso - Create new ISO request (requires authentication)
router.post('/', authenticate, async (req,res)=>{
  try {
    const parsed = CreateSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json(parsed.error.flatten());

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parsed.data.daysValid);

    const iso = await prisma.iSO.create({
      data: {
        ...parsed.data,
        userId: req.user!.userId,
        expiresAt,
      },
    });

    res.status(201).json(iso);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ISO' });
  }
});
