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

// Static uploads
app.use(
  '/api/uploads',
  express.static(path.join(__dirname, 'uploads'))
)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/menu', require('./routes/menu'))
app.use('/api/users', require('./routes/users'))
app.use('/api/orders', require('./routes/orders'))

// MongoDB Connection
const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://USERNAME:PASSWORD@cluster0.begbsqw.mongodb.net/calylas-cafe?retryWrites=true&w=majority&appName=Cluster0'

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')

    // Create default admin if none exists
    const User = require('./models/User')

    const existing = await User.findOne({
      username: 'admin'
    })

    if (!existing) {
      await User.create({
        username: 'admin',
        password: 'admin123',
        role: 'admin'
      })

      console.log(
        '✅ Default admin created — username: admin, password: admin123'
      )
    }

    // Server Port
    const PORT = process.env.PORT || 10000

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err)
  })