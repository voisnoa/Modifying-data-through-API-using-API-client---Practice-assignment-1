const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const MenuItem = require('./MenuItem');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.error('Error connecting to database:', error);
  });

app.use(express.json());

app.post('/menu', async (req, res) => {
  try {
    const payload = req.body;
    const newItem = new MenuItem(payload);
    const savedItem = await newItem.save();
    res.status(201).json({ message: 'Menu item created', data: savedItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
});

app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});