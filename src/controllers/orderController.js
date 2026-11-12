const { createOrder, getAllOrders, getOrderById, updateOrderStatus } = require('../models/orderModel');
const { getCartByUserId, clearCart } = require('../models/cartModel');
const { getComputerById, updateComputer } = require('../models/computerModel');

const checkout = (req, res) => {
  try {
    const { shippingAddress, phone, paymentMethod, items: directItems } = req.body;
    if (!shippingAddress || !phone) {
      return res.status(400).json({ success: false, message: 'Shipping address and phone are required' });
    }

    let orderItems = [];
    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems;
    } else {
      const cart = getCartByUserId(req.user.id);
      if (!cart.items || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }
      orderItems = cart.items;
    }

    let subtotal = 0;
    const processedItems = [];

    for (const item of orderItems) {
      const computer = getComputerById(item.computerId);
      if (!computer) return res.status(404).json({ success: false, message: `Computer ${item.computerId} not found` });
      if (computer.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${computer.name}` });
      }

      const unitPrice = computer.discountPrice || computer.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      processedItems.push({
        computerId: computer.id,
        name: computer.name,
        sku: computer.sku,
        unitPrice,
        quantity: item.quantity,
        lineTotal
      });
    }

    // Deduct stock
    for (const item of processedItems) {
      const computer = getComputerById(item.computerId);
      updateComputer(computer.id, { stock: computer.stock - item.quantity });
    }

    const tax = Number((subtotal * 0.08).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const newOrder = createOrder({
      userId: req.user.id,
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || 'card',
      items: processedItems,
      subtotal,
      tax,
      total
    });

    clearCart(req.user.id);
    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = (req, res) => {
  try {
    const orders = getAllOrders();
    if (req.user.role === 'admin') {
      res.status(200).json({ success: true, message: 'All orders retrieved', data: orders });
    } else {
      const userOrders = orders.filter(o => o.userId === req.user.id);
      res.status(200).json({ success: true, message: 'User orders retrieved', data: userOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderDetails = (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.status(200).json({ success: true, message: 'Order retrieved', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const changeOrderStatus = (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }
    const order = getOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (status === 'cancelled' && order.status !== 'cancelled' && order.status !== 'shipped' && order.status !== 'completed') {
      for (const item of order.items) {
        const computer = getComputerById(item.computerId);
        if (computer) {
          updateComputer(computer.id, { stock: computer.stock + item.quantity });
        }
      }
    }

    const updated = updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, message: 'Order status updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderStats = (req, res) => {
  try {
    const orders = getAllOrders();
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, o) => acc + o.total, 0);
    const totalOrders = orders.length;

    const { getAllComputers } = require('../models/computerModel');
    const computers = getAllComputers();
    const lowStockComputers = computers.filter(c => c.stock <= 3);

    const salesMap = {};
    orders.forEach(o => {
      if (o.status !== 'cancelled') {
        o.items.forEach(i => {
          salesMap[i.computerId] = (salesMap[i.computerId] || 0) + i.quantity;
        });
      }
    });

    const topSelling = Object.entries(salesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([computerId, qty]) => {
        const comp = computers.find(c => c.id === computerId);
        return { computerId, name: comp ? comp.name : 'Unknown', totalSold: qty };
      });

    res.status(200).json({
      success: true,
      message: 'Order stats retrieved',
      data: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        lowStockComputersCount: lowStockComputers.length,
        lowStockComputers,
        topSellingComputers: topSelling
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { checkout, getOrders, getOrderDetails, changeOrderStatus, getOrderStats };
