import express from 'express';
import { shopController } from '../controllers/shopController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/settings', shopController.getSettings); // Public can read shop contact info
router.put('/settings', authenticateAdmin, shopController.updateSettings);

export default router;
