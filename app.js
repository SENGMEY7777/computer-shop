const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Computer Shop API is running successfully' });
});

module.exports = app;
