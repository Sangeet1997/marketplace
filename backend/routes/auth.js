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

router.get('/user/:id',Auth,async(req,res)=>{
  try{
    const userId = req.params.id; // Get user ID from decoded token
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const sanitizedUser = { id: user._id, username: user.username, email: user.email }; 
    res.json(sanitizedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users
router.get('/users', Auth, async (req, res) => {
  try {
    const users = await User.find({}, 'id username email'); // Fetch all users with only username and email fields
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
