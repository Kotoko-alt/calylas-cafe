const fs = require('fs/promises')
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const Menu = require('./models/Menu')

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://USERNAME:PASSWORD@cluster0.begbsqw.mongodb.net/calylas-cafe?retryWrites=true&w=majority&appName=Cluster0'

async function run() {
  const exportDir = path.join(__dirname, 'exports')
  const photosDir = path.join(exportDir, 'photos')

  await fs.mkdir(photosDir, { recursive: true })

  await mongoose.connect(MONGO_URI)
  console.log('✅ MongoDB connected for export')

  const items = await Menu.find().select('+photo.data +photo.contentType')

  const exportItems = []

  for (const item of items) {
    const exportItem = {
      _id: item._id.toString(),
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      photoFilename: item.photo?.filename || '',
      photoContentType: item.photo?.contentType || '',
      photoFile: '',
    }

    if (item.photo?.data && item.photo.contentType) {
      const ext = path.extname(item.photo.filename) || ''
      const fileName = `${item._id}${ext || '.bin'}`
      exportItem.photoFile = fileName
      const savePath = path.join(photosDir, fileName)
      await fs.writeFile(savePath, item.photo.data)
    }

    exportItems.push(exportItem)
  }

  const outputPath = path.join(exportDir, 'menu-export.json')
  await fs.writeFile(outputPath, JSON.stringify(exportItems, null, 2), 'utf8')

  console.log(`✅ Export complete: ${outputPath}`)
  console.log(`✅ ${items.length} menu items exported to ${exportDir}`)

  await mongoose.disconnect()
}

run().catch(err => {
  console.error('❌ Export failed:', err)
  process.exit(1)
})
