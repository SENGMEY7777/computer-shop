const { getAllComputers, getComputerById, createComputer, updateComputer, deleteComputer } = require('../models/computerModel');
const { getCategoryById } = require('../models/categoryModel');
const { getReviewsByComputerId } = require('../models/reviewModel');

const getComputers = (req, res) => {
  try {
    let computers = getAllComputers();
    const { search, categoryId, brand, minPrice, maxPrice, inStock, sort, page = 1, limit = 10 } = req.query;

    if (search) {
      const q = search.toLowerCase();
      computers = computers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        (c.specs && (c.specs.cpu?.toLowerCase().includes(q) || c.specs.gpu?.toLowerCase().includes(q)))
      );
    }

    if (categoryId) computers = computers.filter(c => c.categoryId === categoryId);
    if (brand) computers = computers.filter(c => c.brand.toLowerCase() === brand.toLowerCase());
    if (minPrice) computers = computers.filter(c => c.price >= Number(minPrice));
    if (maxPrice) computers = computers.filter(c => c.price <= Number(maxPrice));
    if (inStock === 'true') computers = computers.filter(c => c.stock > 0);

    if (sort) {
      if (sort === 'price-asc') computers.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') computers.sort((a, b) => b.price - a.price);
      else if (sort === 'newest') computers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const total = computers.length;
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = computers.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({
      success: true,
      message: 'Computers retrieved',
      data: paginated,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComputerDetails = (req, res) => {
  try {
    const computer = getComputerById(req.params.id);
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });

    const category = getCategoryById(computer.categoryId);
    const reviews = getReviewsByComputerId(computer.id);
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

    res.status(200).json({
      success: true,
      message: 'Computer details retrieved',
      data: { ...computer, category: category || null, averageRating: Number(avgRating.toFixed(1)), reviewCount: reviews.length, reviews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addComputer = (req, res) => {
  try {
    const { name, brand, sku, categoryId, price, stock } = req.body;
    if (!name || !brand || !sku || !categoryId || price === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide required computer fields' });
    }
    const newComputer = createComputer(req.body);
    res.status(201).json({ success: true, message: 'Computer created successfully', data: newComputer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editComputer = (req, res) => {
  try {
    const updated = updateComputer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.status(200).json({ success: true, message: 'Computer updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStock = (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) return res.status(400).json({ success: false, message: 'Stock value is required' });
    const updated = updateComputer(req.params.id, { stock: Number(stock) });
    if (!updated) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.status(200).json({ success: true, message: 'Stock updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeComputer = (req, res) => {
  try {
    const success = deleteComputer(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Computer not found' });
    res.status(200).json({ success: true, message: 'Computer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getComputers, getComputerDetails, addComputer, editComputer, updateStock, removeComputer };
