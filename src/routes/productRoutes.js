import express from 'express';
import { getAllProducts } from '../controllers/adminController.js';

const router = express.Router();

/** Public catalog — same payload as admin list, no auth required */
router.get('/products', getAllProducts);

export default router;
