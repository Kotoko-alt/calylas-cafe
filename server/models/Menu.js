const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: '',
  },
  photo: {
    type: String,
    default: '',
  },
}, { timestamps: true })

module.exports = mongoose.model('Menu', menuSchema)