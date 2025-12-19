"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getAllProducts = exports.getAllOrders = exports.getAllUsers = exports.getDashboard = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboard = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalOrders = await prisma.order.count();
        const totalRevenue = await prisma.order.aggregate({
            _sum: { totalAmount: true }
        });
        const pendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        });
        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue._sum?.totalAmount || 0,
            pendingOrders,
            lastUpdated: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};
exports.getDashboard = getDashboard;
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await prisma.user.findMany({
            skip,
            take: parseInt(limit),
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true
            }
        });
        const total = await prisma.user.count();
        res.json({
            items: users,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    }
    catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        let where = {};
        if (status) {
            where.status = status;
        }
        const orders = await prisma.order.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: { items: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
        const total = await prisma.order.count({ where });
        res.json({
            items: orders,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};
exports.getAllOrders = getAllOrders;
// Product Management
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const products = await prisma.product.findMany({
            skip,
            take: parseInt(limit),
            orderBy: { createdAt: 'desc' }
        });
        const total = await prisma.product.count();
        res.json({
            items: products,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getAllProducts = getAllProducts;
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        if (!name || !description || !price || !category || stock === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category: category.toUpperCase(),
                stock
            }
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error('Create product error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        // Convert category to uppercase if provided
        if (data.category) {
            data.category = data.category.toUpperCase();
        }
        const product = await prisma.product.update({
            where: { id },
            data
        });
        res.json(product);
    }
    catch (error) {
        console.error('Update product error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Delete product error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
