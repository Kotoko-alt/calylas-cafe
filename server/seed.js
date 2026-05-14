require('dotenv').config()
const mongoose = require('mongoose')
const Menu = require('./models/Menu')
const items = require('./menuData.json')

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected')
    await Menu.deleteMany({})
    console.log('🗑️ Old menu cleared')
    await Menu.insertMany(items)
    console.log(`✅ ${items.length} menu items added!`)
    process.exit()
  })
  .catch(err => {
    console.error('❌ Error:', err)
    process.exit(1)
  })