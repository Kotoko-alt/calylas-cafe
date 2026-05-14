const router = require('express').Router()
const Order = require('../models/Order')
const auth = require('../middleware/auth')

// Place order (public)
router.post('/', async (req, res) => {
  try {
    const { customer, items, total } = req.body
    const order = new Order({ customer, items, total })
    await order.save()
    res.status(201).json({ message: 'Order placed successfully', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router