import express from 'express';
import{register, login} from '../controllers/authController.js';
import {verifyRecaptcha} from '../middleware/verifyRecaptcha.js';

const router = express.Router();

router.post('/signup', verifyRecaptcha, register);
router.post('/signin', verifyRecaptcha, login);

export default router;