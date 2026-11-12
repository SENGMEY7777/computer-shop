const { getCartByUserId, saveCart, clearCart } = require('../models/cartModel');
const { getComputerById } = require('../models/computerModel');

const getCart = (req, res) => {
  try {
    const cart = getCartByUserId(req.user.id);
    let subtotal = 0;
    const populatedItems = cart.items.map(item => {
      const computer = getComputerById(item.computerId);
      const unitPrice = computer ? (computer.discountPrice || computer.price) : 0;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      return {
        computerId: item.computerId,
        quantity: item.quantity,
        computer: computer || null,
        lineTotal
      };
    });

    res.status(200).json({
      success: true,
      message: 'Cart retrieved',
      data: { id: cart.id, userId: cart.userId, items: populatedItems, subtotal, updatedAt: cart.updatedAt }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addItemToCart = (req, res) => {
  try {
    const { computerId, quantity = 1 } = req.body;
    if (!computerId) return res.status(400).json({ success: false, message: 'computerId is required' });

    const computer = getComputerById(computerId);
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });
    if (computer.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock available' });

    const cart = getCartByUserId(req.user.id);
    const existingItemIdx = cart.items.findIndex(i => i.computerId === computerId);

    if (existingItemIdx >= 0) {
      const newQty = cart.items[existingItemIdx].quantity + Number(quantity);
      if (computer.stock < newQty) return res.status(400).json({ success: false, message: 'Insufficient stock for requested quantity' });
      cart.items[existingItemIdx].quantity = newQty;
    } else {
      cart.items.push({ computerId, quantity: Number(quantity) });
    }

    saveCart(cart);
    res.status(200).json({ success: true, message: 'Item added to cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = (req, res) => {
  try {
    const { computerId } = req.params;
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ success: false, message: 'Quantity is required' });

    const cart = getCartByUserId(req.user.id);
    const item = cart.items.find(i => i.computerId === computerId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.computerId !== computerId);
    } else {
      const computer = getComputerById(computerId);
      if (computer && computer.stock < quantity) {
        return res.status(400).json({ success: false, message: 'Insufficient stock available' });
      }
      item.quantity = Number(quantity);
    }

    saveCart(cart);
    res.status(200).json({ success: true, message: 'Cart updated', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeCartItem = (req, res) => {
  try {
    const { computerId } = req.params;
    const cart = getCartByUserId(req.user.id);
    cart.items = cart.items.filter(i => i.computerId !== computerId);
    saveCart(cart);
    res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const emptyCart = (req, res) => {
  try {
    clearCart(req.user.id);
    res.status(200).json({ success: true, message: 'Cart emptied successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addItemToCart, updateCartItem, removeCartItem, emptyCart };
