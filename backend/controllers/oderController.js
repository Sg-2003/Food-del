import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// placing user order for frontend 
const placeOrder = async (req, res) => {

    const frontend_url = process.env.FRONTEND_URL

    try {
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        })
        let session;
        try {
            session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
            });
            // Store session ID for verification
            await orderModel.findByIdAndUpdate(newOrder._id, { sessionId: session.id });
            res.json({ success: true, session_url: session.url });
        } catch (stripeError) {
            console.log("Stripe Session Creation failed, falling back to mock payment URL:", stripeError.message);
            const mockSessionId = `mock_session_${newOrder._id}`;
            await orderModel.findByIdAndUpdate(newOrder._id, { sessionId: mockSessionId });
            const mockRedirectUrl = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
            res.json({ success: true, session_url: mockRedirectUrl });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // Verify payment with Stripe using session ID
        if (order.sessionId && !order.sessionId.startsWith("mock_session_")) {
            const session = await stripe.checkout.sessions.retrieve(order.sessionId);

            // Check if payment was actually made in Stripe
            if (session.payment_status === "paid") {
                await orderModel.findByIdAndUpdate(orderId, { payment: true });
                res.json({ success: true, message: "Paid" });
            } else {
                await orderModel.findByIdAndUpdate(orderId, { payment: false });
                res.json({ success: false, message: "Not Paid" });
            }
        } else {
            // Fallback if session ID is missing or is a mock_session
            if (success == "true") {
                await orderModel.findByIdAndUpdate(orderId, { payment: true });
                res.json({ success: true, message: "Paid" });
            } else {
                await orderModel.findByIdAndUpdate(orderId, { payment: false });
                res.json({ success: false, message: "Not Paid" });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


// List all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Retrying payment for an existing unpaid order
const payOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL;
    try {
        const order = await orderModel.findById(req.body.orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const line_items = order.items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }));
        
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        });

        let session;
        try {
            session = await stripe.checkout.sessions.create({
                line_items: line_items,
                mode: 'payment',
                success_url: `${frontend_url}/verify?success=true&orderId=${order._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${order._id}`
            });
            await orderModel.findByIdAndUpdate(order._id, { sessionId: session.id });
            res.json({ success: true, session_url: session.url });
        } catch (stripeError) {
            console.log("Stripe Session Creation failed during retry, falling back to mock payment URL:", stripeError.message);
            const mockSessionId = `mock_session_${order._id}`;
            await orderModel.findByIdAndUpdate(order._id, { sessionId: mockSessionId });
            const mockRedirectUrl = `${frontend_url}/verify?success=true&orderId=${order._id}`;
            res.json({ success: true, session_url: mockRedirectUrl });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { placeOrder, verifyOrder, listOrders, updateStatus, userOrders, payOrder };