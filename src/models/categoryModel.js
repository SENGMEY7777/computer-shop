const { readJSON, writeJSON } = require('../config/storage');
const crypto = require('crypto');

const FILE = 'categories.json';

const getAllCategories = () => readJSON(FILE);
const getCategoryById = (id) => getAllCategories().find(c => c.id === id);

const createCategory = (data) => {
  const categories = getAllCategories();
  const newCategory = {
    id: crypto.randomUUID(),
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
    description: data.description || '',
    createdAt: new Date().toISOString()
  };
  categories.push(newCategory);
  writeJSON(FILE, categories);
  return newCategory;
};

const updateCategory = (id, data) => {
  const categories = getAllCategories();
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return null;
  categories[idx] = { ...categories[idx], ...data, updatedAt: new Date().toISOString() };
  writeJSON(FILE, categories);
  return categories[idx];
};

const deleteCategory = (id) => {
  let categories = getAllCategories();
  const idx = categories.findIndex(c => c.id === id);
  if (idx === -1) return false;
  categories = categories.filter(c => c.id !== id);
  writeJSON(FILE, categories);
  return true;
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
