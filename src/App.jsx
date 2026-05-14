// App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Home from './pages/Home'
import Login from './pages/Login'

import AdminLayout from './pages/admin/AdminLayout'
import AdminMenu from './pages/admin/AdminMenu'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'

import ProtectedRoute from './components/ProtectedRoute'

export default function App() {

  return (

    <AuthProvider>

      <CartProvider>

        <BrowserRouter>

          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* ADMIN */}
            <Route
              path="/admin"

              element={
                <ProtectedRoute>

                  <AdminLayout />

                </ProtectedRoute>
              }
            >

              {/* DEFAULT */}
              <Route
                index
                element={<AdminMenu />}
              />

              {/* MENU */}
              <Route
                path="menu"
                element={<AdminMenu />}
              />

              {/* USERS */}
              <Route
                path="users"
                element={<AdminUsers />}
              />

              {/* ORDERS */}
              <Route
                path="orders"
                element={<AdminOrders />}
              />

            </Route>

          </Routes>

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>

  )
}