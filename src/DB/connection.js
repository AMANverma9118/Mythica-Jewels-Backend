import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.DB_URL || process.env.MONGODB_URI;
    if (!uri) {
        console.error("Error: DB_URL or MONGODB_URI must be set");
        return;
    }
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;