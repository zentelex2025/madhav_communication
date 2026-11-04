import express from 'express';
import { customerController } from '../controllers/customerController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', authenticateAdmin, customerController.searchCustomers);

export default router;
