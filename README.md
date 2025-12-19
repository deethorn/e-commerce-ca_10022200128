# Ingrid – E‑Commerce Cloud Application

Ingrid is a simplified Amazon‑style e-commerce platform built as a final-year undergraduate capstone project for **CS/IT 4131 – Cloud Applications**. It demonstrates a complete full-stack deployment where customers can browse products, manage shopping carts, place orders with manual payment verification, and admins can review and approve payments.

**Student Name:** Diamond Chizota  
**Student Index Number:** 10022200128  
**Academic Level:** Level 400

---

## Access the application:

- **Frontend:** https://e-commerce-ca-10022200128-2.vercel.app/
---

## Tech Stack

### Frontend
- **Next.js 14** – React framework with server-side rendering
- **TypeScript** – Type-safe JavaScript
- **Tailwind CSS** – Utility-first styling
- **Axios** – HTTP client for API requests
- **Deployed on Vercel** – Automatic CI/CD from GitHub

### Backend
- **Node.js & Express** – Lightweight REST API framework
- **TypeScript** – Static type checking
- **JWT Authentication** – Stateless, secure user sessions
- **bcryptjs** – Password hashing
- **Deployed on Render** – Automatic builds and deployments

### Database & ORM
- **PostgreSQL** – Relational database (Render Postgres)
- **Prisma ORM** – Type-safe database queries, migrations, seeding
- **Prisma Schema Models:** User, Product, Cart, Order, OrderItem

---

## Core Features

### For Customers
- **User Authentication** – Register, login with JWT tokens
- **Product Browsing** – View products by category (Electronics, Fashion, Home, Books)
- **Shopping Cart** – Add/remove items, manage quantities
- **Payment Proof Upload** – Upload proof of payment for manual verification
- **Order History** – View all orders and their status (Pending, Processing, Shipped, etc.)
- **Ghana Cedi Currency** – All prices displayed in ₵

### For Admins
- **Admin Dashboard** – View pending payment verifications
- **Payment Verification** – Review uploaded proofs and approve/reject payments
- **Order Status Updates** – Update orders to Processing, Shipped, Delivered
- **Role-Based Access Control (RBAC)** – Admin-only endpoints protected by JWT

---

## How to Use (Deployed Version)

**No installation required!** Simply visit the live link and start exploring:

1. **Visit the Frontend**  
   https://e-commerce-ca-10022200128-2.vercel.app/

2. **Register as a Customer**  
   - Sign up with email and password
   - Automatically assigned "CUSTOMER" role

3. **Browse & Shop**
   - Explore products across categories
   - Add items to cart
   - View cart

4. **Checkout**
   - Upload payment proof
   - Submit order (status: "Pending Verification")

5. **Track Orders**
   - View order history
   - See payment and order status updates

### Admin Access
- Login with a pre-seeded admin account:
  - **Email:** admin@ingrid.com
  - **Password:** AdminPassword123!
- Access admin dashboard from navbar (visible only when logged in as admin)
- Review, approve, or reject pending payments
- Update order statuses

---

## Running Locally

### Prerequisites
- Node.js 20+ and npm
- Git
- PostgreSQL (local or cloud instance)

### Clone Repository
```bash
git clone https://github.com/deethorn/ca_10022200128.git
cd ca_10022200128
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
DATABASE_URL=postgresql://user:password@localhost:port/databasename?schema=public
JWT_SECRET=your_jwt_secret_here_min_32_chars
NODE_ENV=development
PORT=3001
```

Initialize database and seed:
```bash
npx prisma migrate
npx ts-node prisma/seed.ts
```

Start backend server:
```bash
npm run dev
```

Backend available at: `http://localhost:3001`

### Frontend Setup

In a new terminal:
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Start frontend:
```bash
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## 📁 Project Structure

```
ca_10022200128/
├── frontend/                  # Next.js application
│   ├── pages/
│   │   ├── index.tsx         # Home page
│   │   ├── login.tsx         # Customer login
│   │   ├── register.tsx      # Customer registration
│   │   ├── products.tsx      # Product listing
│   │   ├── product/[id].tsx  # Product detail
│   │   ├── cart.tsx          # Shopping cart
│   │   ├── orders.tsx        # Order history
│   │   └── admin/            # Admin routes
│   ├── components/           # React components
│   ├── styles/               # Tailwind CSS
│   └── package.json
│
├── backend/                   # Express API
│   ├── src/
│   │   ├── server.ts         # Express app entry point
│   │   ├── middleware/       # Auth, error handling
│   │   ├── routes/           # API endpoints
│   │   └── controllers/      # Business logic
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Seed script
│   │   └── migrations/       # Schema versions
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Authentication & Security

- **JWT Tokens** – Issued on successful login, expire after 1 hour
- **Password Hashing** – bcryptjs with salt rounds
- **Role-Based Access Control** – RBAC protects admin endpoints
- **CORS Configuration** – Allows frontend and backend communication
- **Input Validation** – Both frontend and backend validate user inputs

---

## Deployment Details

### Frontend (Vercel)
- **URL:** https://e-commerce-ca-10022200128-2.vercel.app/
- **Build Command:** `npm run build`
- **Environment Variable:** `NEXT_PUBLIC_API_URL` points to backend

### Backend (Render)
- **Build Command:** `npm install && npx prisma migrate deploy && npm run build`
- **Start Command:** `npm start`
- **Database:** Render Postgres (included)

### CI/CD Workflow
1. Push code to GitHub main branch
2. Vercel automatically builds and deploys frontend (~3 minutes)
3. Render automatically builds and deploys backend
4. Both services scale independently


---

## Known Limitations

1. **Mocked Payments** – Real payment APIs (Stripe, PayPal) not integrated
2. **Fixed Product Catalog** – No admin UI for adding products
3. **No Inventory Decrement** – Stock not reduced on order placement
5. **Basic Search** – Products browsed by category only

These limitations are intentional design choices to maintain project scope while demonstrating core full-stack concepts.

---

## Future Enhancements

- **Real Payment Integration** – Stripe or PayPal API
- **Email Notifications** – Order confirmations, shipping updates
- **Delivery Tracking** – Integration with courier APIs
- **Product Reviews** – Ratings and customer feedback
- **Wishlist Feature** – Save products for later
- **Advanced Search** – Full-text search and filtering
- **Admin Product Management** – Add/edit/delete products via UI
- **Real-Time Updates** – WebSockets for instant notifications

---

## Learning Resources Used

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma ORM Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io)
- [Render Deployment Guide](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## License

This project is created for educational purposes as part of CS/IT 4131 – Cloud Applications coursework. Feel free to use it as a learning reference.

---

**Course:** CS/IT 4131 – Cloud Applications  

