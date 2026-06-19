# Tomato 🍅 - Full Stack Food Delivery App

A premium, full-stack food delivery application built using the MERN stack (MongoDB, Express, React, Node.js). Features include a gorgeous menu list, shopping cart, custom order placement, real-time payment processing via Stripe, live delivery status tracking, and a dedicated admin dashboard.

---

## 🚀 Features

### Customer Portal
- **Modern UI/UX**: Responsive layout built with vanilla CSS featuring smooth transitions and micro-animations.
- **Cart Management**: Add, modify, and remove menu items in real-time.
- **Stripe Checkout Integration**: Seamless, secure card processing via Stripe hosted sessions.
- **Live Order Tracking**: An interactive tracking modal featuring:
  - Vertical/horizontal progress timeline stages (Confirmed ➔ Preparing ➔ On The Way ➔ Delivered).
  - Custom animations (sizzling cooking pan for preparation, animated motorcycle delivery riding along a road for delivery).
  - Manual status refresh with interactive loading indicators.
  - Payment retrying directly from the orders page if previous attempts were cancelled/failed.

### Administration Portal
- **Product Management**: Add, list, and remove food items dynamically.
- **Order Control**: View all customer orders and update their preparation/delivery status (Food Processing, Out for Delivery, Delivered) in real-time.

---

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router DOM, Axios.
- **Backend**: Node.js, Express, Stripe API, JWT Authentication, Multer (for image uploads).
- **Database**: MongoDB (Atlas) with Mongoose.
- **Styling**: Vanilla CSS.

---

## 📦 Project Structure
```
├── admin/       # React administration dashboard
├── backend/     # Express API, MongoDB models, controller logic
└── frontend/    # React customer portal
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js installed.
- MongoDB Atlas account/local database.
- Stripe account for API Keys.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Sg-2003/food-del.git
   cd food-del
   ```

2. **Backend Setup**:
   Create a `.env` file in the `backend/` directory:
   ```env
   JWT_SECRET="your_jwt_secret"
   STRIPE_SECRET_KEY="your_stripe_test_secret_key"
   FRONTEND_URL="http://localhost:5175"
   MONGODB_URI="your_mongodb_connection_uri"
   ```
   Install dependencies and run:
   ```bash
   cd backend
   npm install
   npm run server
   ```

3. **Frontend Setup**:
   Install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Admin Dashboard Setup**:
   Install dependencies and run:
   ```bash
   cd admin
   npm install
   npm run dev
   ```

---

## 💳 Payment Verification Flow
Payments are verified securely using Stripe Session IDs. If a checkout is cancelled or fails, the order remains saved as `Unpaid` inside **My Orders** so that users can click **Pay Now** to retry payment directly without losing their cart contents.
