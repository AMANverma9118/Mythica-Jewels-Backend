import User from '../models/User.js';
import Cart from '../models/Product.js';

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    try {   
        const user = await User.findById(userId);
        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        }else {
            user.cart.push({ productId, quantity });
        }

        await user.save();
        res.status(200).json({ message: "Item added to cart", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to add item to cart", error: error.message });
    }
};

export const getCart = async (req, res) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId).populate('cart.productId');
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve cart", error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Item removed from cart", cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove item from cart", error: error.message });
    }
};
