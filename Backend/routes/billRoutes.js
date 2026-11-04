import express from 'express';
import { billController } from '../controllers/billController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/next-number', authenticateAdmin, billController.getNextInvoiceNo);
router.get('/', authenticateAdmin, billController.getAllBills);
router.get('/:id', authenticateAdmin, billController.getBillById);
router.get('/invoice/:invoiceNo', billController.getBillByInvoiceNo); // Can be viewed with invoice link
router.post('/generate', authenticateAdmin, billController.createBill);

export default router;
