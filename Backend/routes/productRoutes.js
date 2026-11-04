import express from 'express';
import { productController } from '../controllers/productController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (Customers)
router.get('/', productController.getPublicProducts);
router.get('/:id', productController.getProductById);

// Admin routes (Shopkeeper)
router.get('/admin/all', authenticateAdmin, productController.getAdminProducts);
router.get('/admin/dashboard', authenticateAdmin, productController.getDashboard);
router.post('/admin/create', authenticateAdmin, productController.createProduct);
router.put('/admin/:id', authenticateAdmin, productController.updateProduct);
router.delete('/admin/:id', authenticateAdmin, productController.deleteProduct);
router.patch('/admin/:id/visibility', authenticateAdmin, productController.toggleVisibility);
router.post('/admin/:id/units', authenticateAdmin, productController.addUnit);
router.delete('/admin/units/:unitId', authenticateAdmin, productController.deleteUnit);

export default router;
