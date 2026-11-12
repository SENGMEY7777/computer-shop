const { readJSON, writeJSON } = require('../config/storage');
const crypto = require('crypto');

const FILE = 'computers.json';

const getAllComputers = () => readJSON(FILE);
const getComputerById = (id) => getAllComputers().find(c => c.id === id);

const createComputer = (data) => {
  const computers = getAllComputers();
  const newComputer = {
    id: crypto.randomUUID(),
    name: data.name,
    brand: data.brand,
    sku: data.sku,
    categoryId: data.categoryId,
    price: Number(data.price),
    discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
    stock: Number(data.stock) || 0,
    condition: data.condition || 'new',
    specs: data.specs || {
      cpu: data.specs?.cpu || '',
      ram: data.specs?.ram || '',
      storage: data.specs?.storage || '',
      gpu: data.specs?.gpu || '',
      display: data.specs?.display || '',
      os: data.specs?.os || '',
      warrantyMonths: data.specs?.warrantyMonths || 12
    },
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  computers.push(newComputer);
  writeJSON(FILE, computers);
  return newComputer;
};

const updateComputer = (id, data) => {
  const computers = getAllComputers();
  const idx = computers.findIndex(c => c.id === id);
  if (idx === -1) return null;
  computers[idx] = {
    ...computers[idx],
    ...data,
    price: data.price !== undefined ? Number(data.price) : computers[idx].price,
    stock: data.stock !== undefined ? Number(data.stock) : computers[idx].stock,
    updatedAt: new Date().toISOString()
  };
  writeJSON(FILE, computers);
  return computers[idx];
};

const deleteComputer = (id) => {
  let computers = getAllComputers();
  const idx = computers.findIndex(c => c.id === id);
  if (idx === -1) return false;
  computers = computers.filter(c => c.id !== id);
  writeJSON(FILE, computers);
  return true;
};

module.exports = { getAllComputers, getComputerById, createComputer, updateComputer, deleteComputer };
