import express from 'express';
import { cartController } from '../controllers/cartController.js';

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/add', cartController.addItem);
router.put('/items/:itemId', cartController.updateItem);
router.delete('/items/:itemId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

export default router;
