const { readJSON, writeJSON } = require('../config/storage');
const crypto = require('crypto');

const FILE = 'orders.json';

const getAllOrders = () => readJSON(FILE);
const getOrderById = (id) => getAllOrders().find(o => o.id === id);

const createOrder = (orderData) => {
  const orders = getAllOrders();
  const newOrder = {
    id: crypto.randomUUID(),
    orderNumber: 'ORD-' + Date.now().toString().slice(-6) + '-' + Math.floor(Math.random() * 1000),
    userId: orderData.userId,
    shippingAddress: orderData.shippingAddress,
    phone: orderData.phone,
    paymentMethod: orderData.paymentMethod || 'card',
    items: orderData.items,
    subtotal: orderData.subtotal,
    discount: orderData.discount || 0,
    tax: orderData.tax,
    total: orderData.total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.push(newOrder);
  writeJSON(FILE, orders);
  return newOrder;
};

const updateOrderStatus = (id, status) => {
  const orders = getAllOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return null;
  orders[idx].status = status;
  orders[idx].updatedAt = new Date().toISOString();
  writeJSON(FILE, orders);
  return orders[idx];
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus };
