# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Calyla's Café Ordering and Management System

## Project Overview

Calyla's Café Ordering and Management System is a web-based café ordering and management platform designed to streamline customer ordering, menu management, order tracking, and administrative operations.

The system provides an interactive customer interface and an admin dashboard for managing users, menu items, and customer orders.

---

# Features

## Customer Side

* Browse café menu
* View menu categories
* Add items to cart
* Place orders
* View item images and prices

## Admin Side

* Admin authentication/login
* Menu management
* Add/Edit/Delete menu items
* User management
* Order management and status updates
* Dashboard statistics

---

# Technologies Used

## Frontend

* React
* Vite
* Axios
* CSS

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Multer

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/Kotoko-alt/calylas-cafe.git
```

---

## 2. Install Dependencies

### Frontend

```bash
npm install
```

### Backend

```bash
cd server
npm install
```

---

# Running the Project

## Start Backend Server

```bash
cd server
node index.js
```

Backend runs on:

```txt
http://localhost:5000
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Default Admin Account

```txt
Username: admin
Password: admin123
```

---

# Project Structure

```txt
Calyla's Café/
│
├── public/
├── src/
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── index.js
│
├── sample-inputs/
├── README.md
└── package.json
```

---

# Sample Inputs

The project includes sample images and menu item names for testing purposes.

Examples:

* Spanish Latte
* Caramel Macchiato
* Matcha Latte
* French Fries
* Chocolate Cake

---

# Notes

* Uploaded images are stored in the `uploads` folder.
* MongoDB Atlas is used for database storage.
* This project was developed for academic purposes.

---

# Developer

Jimwel Bautista
