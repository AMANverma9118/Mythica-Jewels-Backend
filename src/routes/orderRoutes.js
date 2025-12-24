import express from 'express';
import {placeCODOrder, createOnlineOrder} from '../controllers/orderController.js';
import {auth} from '../middleware/auth.js';
import {verifyRecaptcha} from '../middleware/verifyRecaptcha.js';

const router = express.Router();

router.post('/cod', auth, verifyRecaptcha, placeCODOrder);
router.post('/online', auth, verifyRecaptcha, createOnlineOrder);

export default router;