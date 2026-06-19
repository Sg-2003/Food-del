import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, verifyOrder, listOrders, updateStatus, userOrders, payOrder } from '../controllers/oderController.js';

const orderRouter = express.Router();

orderRouter.post('/place', authMiddleware, placeOrder)
orderRouter.post('/verify', verifyOrder)
orderRouter.get('/list', listOrders)
orderRouter.post('/status', updateStatus)
orderRouter.post('/userorders', authMiddleware, userOrders)
orderRouter.post('/pay', authMiddleware, payOrder)

export default orderRouter;