import express from 'express';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from '../controllers/adminController.js';
import { uploadImages } from '../controllers/uploadController.js';
import { auth } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

router.get('/products', auth, getAllProducts);
router.post('/products', auth, addProduct);
router.put('/products/:productId', auth, updateProduct);
router.delete('/products/:productId', auth, deleteProduct);

router.post('/upload-images', auth, (req, res, next) => {
  uploadProductImages.array('images', 10)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || 'Image upload failed' });
    }
    next();
  });
}, uploadImages);

export default router;