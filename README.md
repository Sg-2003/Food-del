# Tomato 🍅 - Premium Full Stack Food Delivery App

Tomato is a premium, full-stack food delivery application built using the MERN stack (MongoDB, Express, React, Node.js). It offers a complete customer ordering experience, secure payment flow via Stripe, dynamic search, live delivery tracking, and a dedicated admin portal for store owners to manage food listings and orders.

---

## 🚀 Key Features

### 🛒 Customer Portal
- **Modern & Dynamic UI/UX**: Built with Vanilla CSS for full control, featuring smooth transitions, hover effects, and micro-animations.
- **Dynamic Food Search**: Search and filter dishes by name or description in real-time straight from the navbar.
- **Cart Management**: Add, modify, or remove items with instant cart calculation.
- **Stripe Checkout Integration**: Seamless, secure card processing via Stripe-hosted checkout sessions.
- **Live Order Tracking**:
  - Clear timeline showing the order stages: *Food Processing* ➔ *Out for Delivery* ➔ *Delivered*.
  - Fun animations: Sizzling cooking pan for preparation, and a moving delivery bike along a road for transit.
  - Quick refresh indicators to fetch real-time updates.
- **Payment Retry Flow**: If checkout is cancelled or fails, the order is saved as "Unpaid" under **My Orders** so customers can click **Pay Now** to retry payment directly.

### 💼 Administration Dashboard
- **Product Management**: Add new food items with images, assign categories, list existing items, and delete outdated ones.
- **Order Dispatch Control**: View all customer orders, see items, and update order statuses dynamically.

### 🛠️ Core Infrastructure & Windows Development Enhancements
- **Auto-create Storage Folder**: The backend automatically initializes the `uploads` directory on start if it is missing, preventing upload crashes.
- **Windows DNS Resolution Helper**: Includes custom Node.js DNS setup (`dns.setServers`) to resolve Atlas MONGODB connection problems seamlessly in local Windows environments.
- **Vercel Deploy Compatibility**: Pre-configured routes (`vercel.json` rewrite rules) for deploying both the Frontend single-page React app and the Backend Express server correctly.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), React Router DOM, Axios, Context API
- **Backend**: Node.js, Express, Stripe API, JWT Authentication, Multer (for image uploads)
- **Database**: MongoDB (Atlas) with Mongoose
- **Deployment**: Vercel

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
- Node.js installed on your machine.
- A MongoDB Atlas account or local MongoDB instance.
- Stripe account API keys.

---

### Installation & Local Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Sg-2003/Food-del.git
cd "Full Stack Food Delivery App"
```

#### 2. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the root of the `backend/` folder:
   ```env
   JWT_SECRET="your_jwt_secret"
   STRIPE_SECRET_KEY="your_stripe_test_secret_key"
   FRONTEND_URL="http://localhost:5173"
   MONGODB_URI="your_mongodb_connection_string"
   ```
3. Install dependencies and start the local server:
   ```bash
   npm install
   npm run server
   ```
   *The server starts on http://localhost:4000.*

#### 3. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

#### 4. Admin Dashboard Setup
1. Navigate to the `admin/` directory:
   ```bash
   cd ../admin
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the admin portal:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoint Reference

All backend API paths are prefixed with `/api`.

### 🍔 Food Endpoints (`/api/food`)
- `POST /add` - Upload a new food item (Accepts `multipart/form-data` with fields: `name`, `description`, `price`, `category`, and file `image`).
- `GET /list` - Fetch all food items.
- `POST /remove` - Delete a food item (Accepts JSON body: `{ "id": "food_id" }`).

### 👤 User Endpoints (`/api/user`)
- `POST /register` - Register a new account (Accepts: `{ "name", "email", "password" }`).
- `POST /login` - User login (Accepts: `{ "email", "password" }`). Returns JWT Token.

### 🛒 Cart Endpoints (`/api/cart`)
*Requires `token` header for authorization.*
- `POST /add` - Add item to cart (Accepts JSON body: `{ "itemId": "food_id" }`).
- `POST /remove` - Remove item from cart (Accepts JSON body: `{ "itemId": "food_id" }`).
- `POST /get` - Retrieve all items in the user's cart.

### 💳 Order Endpoints (`/api/order`)
- `POST /place` - Create an order and generate Stripe session URL (*Auth Required*; Accepts: `{ "items", "amount", "address" }`).
- `POST /verify` - Verify Stripe session payment completion (Accepts: `{ "orderId", "success" }`).
- `GET /list` - Retrieve all orders across the system (For Admin).
- `POST /status` - Update status of an order (For Admin; Accepts: `{ "orderId", "status" }`).
- `POST /userorders` - Retrieve list of orders placed by the current user (*Auth Required*).
- `POST /pay` - Regenerate Stripe payment session url for a previously failed/unpaid order (*Auth Required*; Accepts: `{ "orderId" }`).

---

## 🚀 Deployment

### Backend on Vercel
Deploy the backend server configuration defined in `backend/vercel.json`:
- Make sure to add the environment variables in your Vercel Project Dashboard corresponding to `JWT_SECRET`, `STRIPE_SECRET_KEY`, `MONGODB_URI`, and `FRONTEND_URL`.
- Build command: *leave empty*
- Output directory: *leave empty*

### Frontend & Admin on Vercel
Deploy static SPA React apps using rewrite rules defined in `frontend/vercel.json` to handle client-side routing.
- Set the backend URL variable accordingly.
- Build command: `npm run build`
- Output directory: `dist`
