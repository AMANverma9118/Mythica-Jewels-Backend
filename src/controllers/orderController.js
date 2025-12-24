import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import User from '../models/User.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getPopulatedUser = async (userId) => {
    return await User.findById(userId).populate('cart.productId');
};

export const placeCODOrder = async (req, res) => {
    const { shippingAddress } = req.body;
    const userId = req.user.userId;

    try {
        const user = await getPopulatedUser(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.cart || user.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

        const totalAmount = user.cart.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

        const newOrder = await Order.create({
            userId: user._id,
            items: user.cart.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price
            })),
            shippingAddress,
            totalAmount,
            paymentMethod: 'COD',
            paymentStatus: 'Pending'
        });

        user.cart = [];
        await user.save();

        res.status(201).json({ message: "Success! Jewelry order placed via COD.", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Initiate Online Order (Razorpay)
export const createOnlineOrder = async (req, res) => {
    const { shippingAddress } = req.body;
    const userId = req.user.userId; 

    try {
        const user = await getPopulatedUser(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        if (!user.cart || user.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

        const totalAmount = user.cart.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, 
            currency: "INR",
            receipt: `order_rcpt_${Date.now()}`
        });

        const newOrder = await Order.create({
            userId: user._id, 
            items: user.cart.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price
            })),
            shippingAddress,
            totalAmount,
            paymentMethod: 'Online',
            paymentStatus: 'Pending',
            razorpayOrderId: razorpayOrder.id
        });

        res.status(200).json({ 
            message: "Razorpay order initialized",
            razorpayOrder, 
            dbOrderId: newOrder._id 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};