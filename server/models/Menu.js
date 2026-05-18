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
    filename: {
      type: String,
      default: '',
    },
    data: {
      type: Buffer,
      select: false,
    },
    contentType: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})

menuSchema.virtual('photoUrl').get(function () {
  if (this.photo && this.photo.contentType) {
    return `/api/menu/${this._id}/photo`
  }
  if (this.photo && this.photo.filename) {
    return `/api/uploads/${this.photo.filename}`
  }
  return ''
})

module.exports = mongoose.model('Menu', menuSchema)