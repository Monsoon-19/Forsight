const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign({ id: user._id }, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout
};
