const { writeJSON } = require('./config/storage');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const seedDatabase = async () => {
  console.log('Seeding database...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const users = [
    {
      id: crypto.randomUUID(),
      name: 'System Admin',
      email: 'admin@computerstore.com',
      phone: '555-0100',
      address: '100 Tech Blvd, Silicon Valley',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'John Customer',
      email: 'john@example.com',
      phone: '555-0200',
      address: '42 Main St, New York',
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    }
  ];
  writeJSON('users.json', users);

  const categories = [
    { id: crypto.randomUUID(), name: 'Gaming Laptops', slug: 'gaming-laptops', description: 'High-performance laptops for hardcore gaming and rendering', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Workstation Desktops', slug: 'workstation-desktops', description: 'Powerful desktop workstations for professionals and AI training', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Ultrabooks', slug: 'ultrabooks', description: 'Slim, lightweight laptops with long battery life', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'PC Components', slug: 'pc-components', description: 'CPUs, GPUs, RAM, and storage drives', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Monitors & Displays', slug: 'monitors-displays', description: 'High refresh rate and 4K displays', createdAt: new Date().toISOString() }
  ];
  writeJSON('categories.json', categories);

  const computers = [
    {
      id: crypto.randomUUID(),
      name: 'Apex Predator Pro Gaming Laptop',
      brand: 'Apex',
      sku: 'APEX-PRO-01',
      categoryId: categories[0].id,
      price: 2199.99,
      discountPrice: 1999.99,
      stock: 12,
      condition: 'new',
      specs: { cpu: 'Intel Core i9-14900HX', ram: '32GB DDR5', storage: '2TB NVMe SSD', gpu: 'NVIDIA RTX 4080 12GB', display: '17.3" 240Hz QHD', os: 'Windows 11 Pro', warrantyMonths: 24 },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'Titan X Workstation Desktop',
      brand: 'Titan',
      sku: 'TITAN-X-99',
      categoryId: categories[1].id,
      price: 3499.99,
      discountPrice: null,
      stock: 5,
      condition: 'new',
      specs: { cpu: 'AMD Ryzen Threadripper 7960X', ram: '64GB DDR5 ECC', storage: '4TB NVMe SSD', gpu: 'NVIDIA RTX 4090 24GB', display: 'None', os: 'Ubuntu 24.04 LTS', warrantyMonths: 36 },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'Zephyr Slim 14 Ultrabook',
      brand: 'Zephyr',
      sku: 'ZEP-14-SLIM',
      categoryId: categories[2].id,
      price: 1299.99,
      discountPrice: 1199.99,
      stock: 20,
      condition: 'new',
      specs: { cpu: 'Intel Core Ultra 7 155H', ram: '16GB LPDDR5X', storage: '1TB SSD', gpu: 'Intel Arc Graphics', display: '14" 2.8K OLED 120Hz', os: 'Windows 11 Home', warrantyMonths: 12 },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'NVIDIA GeForce RTX 4070 Ti Super',
      brand: 'NVIDIA',
      sku: 'GPU-4070-TIS',
      categoryId: categories[3].id,
      price: 799.99,
      discountPrice: 749.99,
      stock: 8,
      condition: 'new',
      specs: { cpu: 'N/A', ram: '16GB GDDR6X', storage: 'N/A', gpu: 'RTX 4070 Ti Super', display: 'N/A', os: 'N/A', warrantyMonths: 36 },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'UltraGear 34" Curved Gaming Monitor',
      brand: 'LG',
      sku: 'MON-LG-34',
      categoryId: categories[4].id,
      price: 599.99,
      discountPrice: 499.99,
      stock: 15,
      condition: 'new',
      specs: { cpu: 'N/A', ram: 'N/A', storage: 'N/A', gpu: 'N/A', display: '34" UWQHD 160Hz IPS', os: 'N/A', warrantyMonths: 12 },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  writeJSON('computers.json', computers);

  writeJSON('cart.json', []);
  writeJSON('orders.json', []);

  const reviews = [
    {
      id: crypto.randomUUID(),
      computerId: computers[0].id,
      userId: users[1].id,
      userName: users[1].name,
      rating: 5,
      comment: 'Absolute beast of a gaming laptop! Handles everything on ultra settings.',
      createdAt: new Date().toISOString()
    }
  ];
  writeJSON('reviews.json', reviews);

  console.log('Database seeded successfully!');
};

seedDatabase();
