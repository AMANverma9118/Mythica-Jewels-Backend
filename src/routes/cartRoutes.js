import express from 'express';
import { auth } from '../middleware/auth.js';
import { 
  addToCart, 
  getCart, 
  removeFromCart, 
  updateQuantity,
  clearCart 
} from '../controllers/cartController.js';

const router = express.Router();

router.use(auth);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateQuantity);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;