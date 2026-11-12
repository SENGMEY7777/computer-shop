const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../models/categoryModel');
const { getAllComputers } = require('../models/computerModel');

const getCategories = (req, res) => {
  try {
    const categories = getAllCategories();
    res.status(200).json({ success: true, message: 'Categories retrieved', data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addCategory = (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
    const newCat = createCategory({ name, description });
    res.status(201).json({ success: true, message: 'Category created', data: newCat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editCategory = (req, res) => {
  try {
    const { id } = req.params;
    const updated = updateCategory(id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeCategory = (req, res) => {
  try {
    const { id } = req.params;
    const computers = getAllComputers();
    const hasComputers = computers.some(c => c.categoryId === id);
    if (hasComputers) {
      return res.status(400).json({ success: false, message: 'Cannot delete category containing computers' });
    }
    const success = deleteCategory(id);
    if (!success) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, addCategory, editCategory, removeCategory };
