const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const Menu = require('../models/Menu')
const auth = require('../middleware/auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
})
const upload = multer({ storage })

// Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Create menu item (admin only)
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body
    const item = new Menu({
      name,
      description,
      price,
      category,
      photo: req.file ? req.file.filename : '',
    })
    await item.save()
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update menu item (admin only)
router.put('/:id', auth, upload.single('photo'), async (req, res) => {
  try {
    const { name, description, price, category } = req.body
    const update = { name, description, price, category }
    if (req.file) update.photo = req.file.filename
    const item = await Menu.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete menu item (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Item not found' })
    res.json({ message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router