import { Router } from 'express';
import * as cartController from '../controllers/cartController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.delete('/items/:id', authMiddleware, cartController.removeFromCart);
router.patch('/items/:id', authMiddleware, cartController.updateQuantity);


export default router;
