import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const uploadRouter = Router();

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * POST /api/upload
 * Validates base64 data URLs or uploaded payload for avatar / measurement photos / fabric samples
 */
uploadRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { dataUrl, filename, mimeType, size } = req.body;

    if (!dataUrl && !req.body.image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const imageContent = dataUrl || req.body.image;

    // Detect MIME from header or dataUrl prefix
    let detectedMime = mimeType || 'image/jpeg';
    if (typeof imageContent === 'string' && imageContent.startsWith('data:')) {
      const match = imageContent.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      if (match) {
        detectedMime = match[1];
      }
    }

    if (!ALLOWED_MIME_TYPES.includes(detectedMime.toLowerCase())) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.',
        code: 'INVALID_MIME_TYPE',
        allowedTypes: ALLOWED_MIME_TYPES,
      });
    }

    // Estimate base64 byte size
    const base64Length = imageContent.length - (imageContent.indexOf(',') + 1);
    const estimatedSizeBytes = (base64Length * 3) / 4;

    if (estimatedSizeBytes > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        error: 'File size exceeds maximum allowed limit of 5MB.',
        code: 'FILE_TOO_LARGE',
        maxSizeMb: 5,
      });
    }

    // Return sanitized dataUrl or mock storage URL
    const sanitizedFilename = (filename || 'upload.webp').replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeUrl = imageContent.startsWith('data:') ? imageContent : `data:${detectedMime};base64,${imageContent}`;

    res.json({
      success: true,
      url: safeUrl,
      filename: sanitizedFilename,
      mimeType: detectedMime,
      sizeBytes: Math.round(estimatedSizeBytes),
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to process file upload' });
  }
});
