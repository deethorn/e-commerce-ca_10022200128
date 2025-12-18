import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import * as orderController from '../controllers/orderController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

// Dashboard
router.get('/dashboard', authMiddleware, adminOnly, adminController.getDashboard);

// Users
router.get('/users', authMiddleware, adminOnly, adminController.getAllUsers);

// Orders
router.get('/orders', authMiddleware, adminOnly, adminController.getAllOrders);
router.get('/orders/pending-verification', authMiddleware, adminOnly, orderController.getPendingVerificationOrders);
router.patch('/orders/:id/verify-payment', authMiddleware, adminOnly, orderController.verifyPayment);

// Products (Inventory Management)
router.get('/products', authMiddleware, adminOnly, adminController.getAllProducts);
router.post('/products', authMiddleware, adminOnly, adminController.createProduct);
router.patch('/products/:id', authMiddleware, adminOnly, adminController.updateProduct);
router.delete('/products/:id', authMiddleware, adminOnly, adminController.deleteProduct);

export default router;
