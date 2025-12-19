import { PrismaClient, UserRole, ProductCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();


async function seed() {
  try {
    console.log('Starting database seed...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const customerPassword = await bcrypt.hash('Password123!', 10);

    // Create users
    console.log('Creating users...');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@ingrid.com' },
      update: {},
      create: {
        email: 'admin@ingrid.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN
      }
    });

    const customer = await prisma.user.upsert({
      where: { email: 'customer@ingrid.com' },
      update: {},
      create: {
        email: 'customer@ingrid.com',
        password: customerPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.CUSTOMER
      }
    });

    console.log(`✓ Created users: ${admin.email}, ${customer.email}`);

    // Create products
    console.log(' Creating products...');
    const products = [
      // Electronics
      {
        name: 'Wireless Headphones',
        description: 'High-quality Bluetooth headphones with noise cancellation',
        price: 9999,
        category: ProductCategory.ELECTRONICS,
        stock: 50
      },
      {
        name: 'USB-C Charger',
        description: 'Fast charging USB-C charger, 65W output',
        price: 2999,
        category: ProductCategory.ELECTRONICS,
        stock: 100
      },
      {
        name: 'Phone Case',
        description: 'Durable protective phone case, multiple colors',
        price: 1599,
        category: ProductCategory.ELECTRONICS,
        stock: 200
      },

      // Fashion
      {
        name: 'Cotton T-Shirt',
        description: '100% organic cotton t-shirt, comfortable fit',
        price: 2499,
        category: ProductCategory.FASHION,
        stock: 150
      },
      {
        name: 'Denim Jeans',
        description: 'Classic blue jeans, perfect fit',
        price: 4999,
        category: ProductCategory.FASHION,
        stock: 80
      },
      {
        name: 'Casual Sneakers',
        description: 'Comfortable everyday sneakers',
        price: 6999,
        category: ProductCategory.FASHION,
        stock: 60
      },

      // Home Essentials
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker, 12-cup capacity',
        price: 3999,
        category: ProductCategory.HOME_ESSENTIALS,
        stock: 40
      },
      {
        name: 'Stainless Steel Pans Set',
        description: 'Set of 3 high-quality cooking pans',
        price: 7999,
        category: ProductCategory.HOME_ESSENTIALS,
        stock: 30
      },
      {
        name: 'Kitchen Knife Set',
        description: '6-piece professional kitchen knife set',
        price: 5999,
        category: ProductCategory.HOME_ESSENTIALS,
        stock: 25
      },

      // Books
      {
        name: 'Cloud Computing Fundamentals',
        description: 'Comprehensive guide to cloud computing concepts and practices',
        price: 2999,
        category: ProductCategory.BOOKS,
        stock: 100
      },
      {
        name: 'Web Development with React',
        description: 'Modern web development techniques with React',
        price: 3499,
        category: ProductCategory.BOOKS,
        stock: 85
      },
      {
        name: 'Database Design Principles',
        description: 'Learn database design and optimization strategies',
        price: 3199,
        category: ProductCategory.BOOKS,
        stock: 70
      }
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { name: product.name },
        update: {},
        create: product
      });
    }

    console.log('✓ Created 12 products across 4 categories');

    // Create cart for customer
    console.log('Creating shopping cart...');
    const cart = await prisma.cart.upsert({
      where: { userId: customer.id },
      update: {},
      create: { userId: customer.id }
    });

    // Add sample item to cart
    const headphones = await prisma.product.findUnique({
      where: { name: 'Wireless Headphones' }
    });

    if (headphones) {
      await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId: cart.id, productId: headphones.id } },
        update: { quantity: 1 },
        create: {
          cartId: cart.id,
          productId: headphones.id,
          quantity: 1
        }
      });
    }

    console.log('✓ Created cart with sample items');

    // Create sample order
    console.log('Creating sample order...');
    const order = await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: 12998,
        status: 'DELIVERED',
        shippingAddress: '123 Main St, Tech City, TC 12345',
        items: {
          create: [
            {
              productId: headphones?.id || '',
              quantity: 1,
              priceAtPurchase: 9999
            }
          ]
        }
      }
    });

    console.log('✓ Created sample order');

    console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Database Seeding Complete!                                 ║
║                                                                ║
║  Admin Account:                                             ║
║     Email: admin@ingrid.com                                    ║
║     Password: AdminPass123!                                    ║
║                                                                ║
║  Customer Account:                                          ║
║     Email: customer@ingrid.com                                 ║
║     Password: Password123!                                     ║
║                                                                ║
║  Data Created:                                              ║
║     ✓ 2 Users (1 Admin, 1 Customer)                            ║
║     ✓ 12 Products (4 categories)                               ║
║     ✓ 1 Shopping Cart (with items)                             ║
║     ✓ 1 Sample Order                                           ║
║                                                                ║
║  Next Step: npm run dev                                     ║
╚════════════════════════════════════════════════════════════════╝
    `);
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
