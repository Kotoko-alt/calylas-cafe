const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { _id: user._id, username: user.username, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
router.get('/me', auth, (req, res) => {
  res.json(req.user)
})

module.exports = router