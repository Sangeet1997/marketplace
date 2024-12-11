// routes/items.js
const express = require('express');
const Item = require('../models/Items.js');
const router = express.Router();

// Create a new item
router.post('/', async (req, res) => {
  const { name, description, price, image, owner } = req.body;
  try {
    const newItem = new Item({ name, description, price, image, owner });
    // console.log(newItem);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ status: 'available' }).populate('owner', 'username');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('owner', 'username');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, status } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, status },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
