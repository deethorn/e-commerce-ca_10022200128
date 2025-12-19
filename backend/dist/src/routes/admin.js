"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController = __importStar(require("../controllers/adminController"));
const orderController = __importStar(require("../controllers/orderController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Dashboard
router.get('/dashboard', auth_1.authMiddleware, auth_1.adminOnly, adminController.getDashboard);
// Users
router.get('/users', auth_1.authMiddleware, auth_1.adminOnly, adminController.getAllUsers);
// Orders
router.get('/orders', auth_1.authMiddleware, auth_1.adminOnly, adminController.getAllOrders);
router.get('/orders/pending-verification', auth_1.authMiddleware, auth_1.adminOnly, orderController.getPendingVerificationOrders);
router.patch('/orders/:id/verify-payment', auth_1.authMiddleware, auth_1.adminOnly, orderController.verifyPayment);
// Products (Inventory Management)
router.get('/products', auth_1.authMiddleware, auth_1.adminOnly, adminController.getAllProducts);
router.post('/products', auth_1.authMiddleware, auth_1.adminOnly, adminController.createProduct);
router.patch('/products/:id', auth_1.authMiddleware, auth_1.adminOnly, adminController.updateProduct);
router.delete('/products/:id', auth_1.authMiddleware, auth_1.adminOnly, adminController.deleteProduct);
exports.default = router;
