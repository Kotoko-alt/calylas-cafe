const router = require('express').Router()
const User = require('../models/User')
const auth = require('../middleware/auth')

// Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create user (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { username, password, role } = req.body
    const existing = await User.findOne({ username })
    if (existing) return res.status(400).json({ message: 'Username already exists' })

    const user = new User({ username, password, role })
    await user.save()
    res.status(201).json({ _id: user._id, username: user.username, role: user.role })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete user (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' })
    }
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router