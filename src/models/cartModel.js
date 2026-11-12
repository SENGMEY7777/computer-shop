const { readJSON, writeJSON } = require('../config/storage');
const crypto = require('crypto');

const FILE = 'cart.json';

const getAllCarts = () => readJSON(FILE);
const getCartByUserId = (userId) => {
  const carts = getAllCarts();
  let cart = carts.find(c => c.userId === userId);
  if (!cart) {
    cart = { id: crypto.randomUUID(), userId, items: [], updatedAt: new Date().toISOString() };
    carts.push(cart);
    writeJSON(FILE, carts);
  }
  return cart;
};

const saveCart = (cart) => {
  const carts = getAllCarts();
  const idx = carts.findIndex(c => c.userId === cart.userId);
  cart.updatedAt = new Date().toISOString();
  if (idx >= 0) {
    carts[idx] = cart;
  } else {
    carts.push(cart);
  }
  writeJSON(FILE, carts);
  return cart;
};

const clearCart = (userId) => {
  const carts = getAllCarts();
  const idx = carts.findIndex(c => c.userId === userId);
  if (idx >= 0) {
    carts[idx].items = [];
    carts[idx].updatedAt = new Date().toISOString();
    writeJSON(FILE, carts);
  }
};

module.exports = { getCartByUserId, saveCart, clearCart };
