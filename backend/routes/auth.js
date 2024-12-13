const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const Auth = require('../middleware/auth.js');

const router = express.Router();

// Register new users
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error :"+err });
  }
});

// Login users
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get('/user/:id', Auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('boughtItems').populate('soldItems');
    if (!user) return res.status(404).json({ msg: "User not found" });

    const sanitizedUser = { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      boughtItems: user.boughtItems,
      soldItems: user.soldItems,
      image: user.image
    }; 
    res.json(sanitizedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users
router.get('/users', Auth, async (req, res) => {
  try {
    const users = await User.find({}, 'id username email image soldItems boughtItems'); // Fetch all users with only username and email fields
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a bought item to user
router.post('/user/buy-item', Auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user; // From auth middleware

    // Validate itemId 
    if (!itemId) {
      return res.status(400).json({ msg: "Item ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if item already exists in bought items to avoid duplicates
    if (!user.boughtItems.includes(itemId)) {
      console.log(itemId)
      user.boughtItems.push(itemId);
      await user.save();
    }

    res.json({ 
      msg: "Item added to bought items", 
      boughtItems: user.boughtItems 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Add a sold item to user
router.post('/user/sell-item', Auth, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user; // From auth middleware

    // Validate itemId 
    if (!itemId) {
      return res.status(400).json({ msg: "Item ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if item already exists in sold items to avoid duplicates
    if (!user.soldItems.includes(itemId)) {
      console.log(itemId)
      user.soldItems.push(itemId);
      await user.save();
    }

    res.json({ 
      msg: "Item added to sold items", 
      soldItems: user.soldItems 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post('/user/update-image', Auth, async (req, res) => {
  const { image } = req.body;
  const userId = req.user;
  const user = await User.findById(userId);
  user.image = image;
  await user.save();
  res.json({ msg: "Image updated", image: user.image });
}); 

module.exports = router;