import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

const allowedTypes = /jpeg|jpg|png|webp|gif/;

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const mimeOk = allowedTypes.test(file.mimetype.split('/')[1] || '');
  const extOk = allowedTypes.test(ext);
  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'));
  }
}

export const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 8 },
});
