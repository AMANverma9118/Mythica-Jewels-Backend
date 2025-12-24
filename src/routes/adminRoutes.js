import express from 'express';
import {addProduct,updateProduct,deleteProduct,getAllProducts} from '../controllers/adminController.js';
import {auth} from '../middleware/auth.js';

const router = express.Router();

router.post('/products', auth, addProduct);
router.put('/products/:productId', auth, updateProduct);
router.delete('/products/:productId', auth, deleteProduct);
router.get('/products', auth, getAllProducts);

export default router;