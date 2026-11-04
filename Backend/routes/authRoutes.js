import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', authenticateAdmin, authController.me);

export default router;
