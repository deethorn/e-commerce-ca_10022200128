import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id', authMiddleware, adminOnly, orderController.updateOrderStatus);
router.post('/:id/payment', authMiddleware, orderController.uploadPaymentProof);

export default router;
