const { readJSON, writeJSON } = require('../config/storage');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const FILE = 'users.json';

const getAllUsers = () => readJSON(FILE);
const getUserById = (id) => getAllUsers().find(u => u.id === id);
const getUserByEmail = (email) => getAllUsers().find(u => u.email.toLowerCase() === email.toLowerCase());

const createUser = async (userData) => {
  const users = getAllUsers();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = {
    id: crypto.randomUUID(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    phone: userData.phone || '',
    address: userData.address || '',
    password: hashedPassword,
    role: userData.role || 'customer',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJSON(FILE, users);
  const { password, ...safeUser } = newUser;
  return safeUser;
};

const updateUser = (id, updateData) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updateData, updatedAt: new Date().toISOString() };
  writeJSON(FILE, users);
  const { password, ...safeUser } = users[index];
  return safeUser;
};

const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

module.exports = { getAllUsers, getUserById, getUserByEmail, createUser, updateUser, matchPassword };
