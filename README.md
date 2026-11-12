# Computer Store REST API Backend

A robust Node.js and Express.js REST API backend for an e-commerce computer store, featuring local JSON file persistence, JWT authentication, role-based access control, shopping cart management, order checkout, and review systems.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Storage:** Local JSON files in `/data`

## Project Structure
```
Computer-Api/
├── data/
├── src/
│   ├── config/storage.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── package.json
└── README.md
```

## Setup & Running
1. Install dependencies:
   ```bash
   npm install
   ```
2. Seed sample data (1 admin, 1 customer, categories, computers):
   ```bash
   npm run seed
   ```
3. Start development server (with auto-watch):
   ```bash
   npm run dev
   ```
4. Start production server:
   ```bash
   npm start
   ```

## API Endpoints & Curl Examples

### 1. Health Check
```bash
curl -X GET http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@computerstore.com","password":"password123"}'
```

### 4. Get Computers with Filters
```bash
curl -X GET "http://localhost:5000/api/computers?brand=Apex&inStock=true"
```

### 5. Checkout / Place Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"shippingAddress":"123 Silicon Way","phone":"555-9999","paymentMethod":"card"}'
```
