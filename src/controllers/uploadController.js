import fs from 'fs';

/**
 * Save uploaded images as base64 data URLs in MongoDB.
 * Files are not kept on disk — images persist even after server restarts.
 */
export const uploadImages = (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const urls = req.files.map((file) => {
      const buffer = fs.readFileSync(file.path);
      const base64 = buffer.toString('base64');
      const mime = file.mimetype || 'image/jpeg';
      try {
        fs.unlinkSync(file.path);
      } catch {
        /* ignore cleanup errors */
      }
      return `data:${mime};base64,${base64}`;
    });

    res.status(200).json({
      message: 'Images uploaded successfully',
      urls,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to upload images',
      error: error.message,
    });
  }
};
