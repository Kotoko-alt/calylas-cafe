const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  items: [
    {
      name: { type: String },
      price: { type: Number },
      qty: { type: Number },
    }
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)