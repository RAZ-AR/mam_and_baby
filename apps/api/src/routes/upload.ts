import { Router } from 'express';
import { upload } from '../lib/upload';
import { authenticate } from '../middleware/auth';
import { prisma } from '../lib/prisma';

export const router = Router();

// POST /upload - Upload single image (requires authentication)
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Generate URL for the uploaded file
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// POST /upload/listing/:listingId - Upload photos for a listing (requires authentication)
router.post('/listing/:listingId', authenticate, upload.array('photos', 5), async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Verify listing belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Not authorized to upload photos for this listing' });
    }

    // Create photo records
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const photoPromises = req.files.map((file) => {
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      return prisma.photo.create({
        data: {
          url: fileUrl,
          listingId,
        },
      });
    });

    const photos = await Promise.all(photoPromises);

    res.status(201).json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});
