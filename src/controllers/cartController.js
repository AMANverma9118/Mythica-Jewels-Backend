import User from '../models/User.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

/* ==================== ADD TO CART ==================== */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    await user.populate('cart.productId');

    const transformedCart = user.cart.map(item => ({
      _id: item._id,
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.imageUrl,
        description: item.productId.description,
        category: item.productId.category
      },
      quantity: item.quantity
    }));

    res.status(200).json({ 
      message: "Item added to cart", 
      cart: transformedCart 
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      message: "Failed to add item to cart", 
      error: error.message 
    });
  }
};

/* ==================== GET CART ==================== */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).populate('cart.productId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transformedCart = user.cart.map(item => {
      if (!item.productId) {
        return null;
      }

      return {
        _id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.imageUrl, 
          description: item.productId.description,
          category: item.productId.category
        },
        quantity: item.quantity
      };
    }).filter(item => item !== null); 

    res.status(200).json({ cart: transformedCart });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      message: "Failed to retrieve cart", 
      error: error.message 
    });
  }
};

/* ==================== REMOVE FROM CART ==================== */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    await user.populate('cart.productId');

    const transformedCart = user.cart.map(item => {
      if (!item.productId) return null;

      return {
        _id: item._id,
        product: {
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: item.productId.imageUrl,
          description: item.productId.description
        },
        quantity: item.quantity
      };
    }).filter(item => item !== null);

    res.status(200).json({ 
      message: "Item removed from cart", 
      cart: transformedCart 
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      message: "Failed to remove item from cart", 
      error: error.message 
    });
  }
};

/* ==================== UPDATE QUANTITY (Optional but recommended) ==================== */
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const itemIndex = user.cart.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    user.cart[itemIndex].quantity = quantity;
    await user.save();
    await user.populate('cart.productId');

    const transformedCart = user.cart.map(item => ({
      _id: item._id,
      product: {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.imageUrl
      },
      quantity: item.quantity
    }));

    res.status(200).json({ 
      message: "Cart updated", 
      cart: transformedCart 
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      message: 'Error updating cart',
      error: error.message 
    });
  }
};

/* ==================== CLEAR CART ==================== */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }

    res.json({ message: 'Cart cleared', cart: [] });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      message: 'Error clearing cart',
      error: error.message 
    });
  }
};