const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/menu', require('./routes/menu'))
app.use('/api/users', require('./routes/users'))
app.use('/api/orders', require('./routes/orders'))

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')

    // Create default admin if none exists
    const User = require('./models/User')
    const existing = await User.findOne({ username: 'admin' })
    if (!existing) {
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' })
      console.log('✅ Default admin created — username: admin, password: admin123')
    }

    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.error('❌ MongoDB error:', err))