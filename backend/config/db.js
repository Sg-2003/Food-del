import mongoose from "mongoose";

export const connectDB = async () => {
    const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-del';
    await mongoose.connect(dbUri).then(() => console.log("DB Connected"));
}
