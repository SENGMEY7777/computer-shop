const { createUser, getUserByEmail, getUserById, updateUser, matchPassword } = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretcomputerapisecretkey12345', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const user = await createUser({ name, email, password, phone, address, role });
    const token = generateToken(user.id);
    res.status(201).json({ success: true, message: 'User registered successfully', data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }
    const user = getUserByEmail(email);
    if (user && (await matchPassword(password, user.password))) {
      const token = generateToken(user.id);
      const { password: _, ...safeUser } = user;
      res.status(200).json({ success: true, message: 'Logged in successfully', data: { user: safeUser, token } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = getUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.status(200).json({ success: true, message: 'Profile retrieved', data: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updated = updateUser(req.user.id, { name, phone, address });
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
