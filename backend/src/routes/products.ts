import { Router } from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, adminOnly, productController.createProduct);
router.put('/:id', authMiddleware, adminOnly, productController.updateProduct);
router.delete('/:id', authMiddleware, adminOnly, productController.deleteProduct);

export default router;
