import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateOrderRequest } from '../types';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { items, shippingAddress } = req.body as CreateOrderRequest;

    if (!items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: req.user.userId,
        totalAmount,
        shippingAddress,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: { items: true }
    });

    // Clear user's cart
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: req.user.userId } }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check ownership
    if (order.userId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true }
    });

    res.json(order);
  } catch (error: any) {
    console.error('Update order error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const uploadPaymentProof = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { paymentProof, paymentMethod } = req.body;

    if (!paymentProof) {
      return res.status(400).json({ error: 'Payment proof required' });
    }

    // Find order and verify ownership
    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Update order with payment proof and status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentProof,
        paymentStatus: 'PENDING_VERIFICATION',
        status: 'PENDING_VERIFICATION'
      },
      include: { items: { include: { product: true } } }
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ error: 'Failed to upload payment proof' });
  }
};

export const getPendingVerificationOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { paymentStatus: 'PENDING_VERIFICATION' },
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: 'asc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get pending verification orders error:', error);
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (approved === undefined) {
      return res.status(400).json({ error: 'Approval status required' });
    }

    const paymentStatus = approved ? 'APPROVED' : 'REJECTED';
    const orderStatus = approved ? 'PROCESSING' : 'PENDING';

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
        status: orderStatus
      },
      include: { items: { include: { product: true } }, user: true }
    });

    res.json(updatedOrder);
  } catch (error: any) {
    console.error('Verify payment error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};
