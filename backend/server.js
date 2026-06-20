import express from 'express';
import dns from 'dns';

// Fix Node.js DNS SRV resolution issues on Windows local environments
try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
    console.warn("DNS setServers failed:", err.message);
}

import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

//DB connection
connectDB();

//api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'))
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);




app.get('/', (req, res) => {
    res.send('API Working');
}
);

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
}
);

export default app;

