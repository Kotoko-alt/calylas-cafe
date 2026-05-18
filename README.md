# Calyla's Café Ordering and Management System

## Project Overview

Calyla's Café is a web-based ordering and management platform for a café business. It provides a customer-facing storefront with menu browsing, filtering, image display, cart management, and order placement, plus an admin dashboard for managing menus, users, and orders.

## Key Features

### Customer Interface
- Browse menu items by category
- Search menu items by name
- View menu photos and descriptions
- Add products to cart
- Checkout with order creation

### Admin Interface
- Login-protected admin area
- Add, edit, delete menu items
- View and manage orders
- Manage users
- Upload menu photos

## Technologies Used

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- Multer
- dotenv

## Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/Kotoko-alt/calylas-cafe.git
cd "Calyla's Café"
```

### 2. Install dependencies

```bash
npm install
cd server
npm install
```

### 3. Start backend server

```bash
cd server
node index.js
```

The backend server runs at:

```txt
http://localhost:5000
```

### 4. Start frontend app

From the project root:

```bash
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173
```

## Default Admin Credentials

```txt
Username: admin
Password: admin123
```

> If you want to change this, update the admin data in the backend user seed or database.

## Sample Inputs

This project includes a `sample-inputs` folder with example menu names and upload guidance.

### Included files
- `sample-inputs/menu-names.txt` — example menu item names
- `sample-inputs/menu-data.csv` — sample mapping of menu names to photo filenames
- `sample-inputs/README.md` — instructions on how to use sample data

### Photo sample workflow
1. Copy photo files into `server/uploads/`
2. Use matching filenames in `sample-inputs/menu-data.csv`
3. Upload or create menu items in the admin panel to map photo names to menu items

## Database Dump / Export

### Optional DB dump
If you need a MongoDB dump, use `mongodump` or the built-in export script.

#### Using built-in export utility
```bash
cd server
npm run export-menu
```

This generates:
- `server/exports/menu-export.json`
- `server/exports/photos/`

#### Using mongodump (optional)
```bash
mongodump --uri="<your-mongodb-uri>" --db <database-name> --out db-dump
```

## How to deliver the final project

### 1. Code repository link
- Push the project to GitHub and share the repository URL
- Or zip the folder and upload to Google Drive, then share the link

### 2. Style guide
- Create a PDF or image from the `STYLE_GUIDE.md` file
- Include brand colors, fonts, button style, and sample screens

### 3. DB dump
- Provide the exported MongoDB files if asked
- Otherwise mention that database export is optional

### 4. README
- This file is the main README for reviewers
- It explains how to run the project and where the sample input files are

### 5. Sample input
- Use the files in `sample-inputs/`
- Provide an example list of menu items and matching image filenames

## Project Structure

```txt
Calyla's Café/
├── public/
├── src/
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── export-menu.js
│   └── index.js
├── sample-inputs/
│   ├── menu-names.txt
│   ├── menu-data.csv
│   └── README.md
├── README.md
├── package.json
└── vite.config.js
```

## Notes

- Menu photos are served via backend uploads and the MongoDB photo endpoint.
- The frontend uses fallback image candidate logic for menu items with missing photos.
- You can export current menu data with `npm run export-menu` from the `server` folder.

## Developer

Jimwel Bautista
