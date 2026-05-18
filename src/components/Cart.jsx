import { useState } from 'react'
import { useCart } from '../context/CartContext'
import axios from 'axios'

const normalizeMenuName = name =>
  name
    .trim()
    .replace(/[’'\.,]/g, '')
    .replace(/\s+/g, ' ')

const buildMenuNameCandidates = name => {
  if (!name) return []
  const normalized = normalizeMenuName(name)
  const compact = normalized.replace(/\s+/g, '')
  const dash = normalized.replace(/\s+/g, '-')
  const underscore = normalized.replace(/\s+/g, '_')
  return [normalized, compact, dash, underscore].filter((value, index, self) => value && self.indexOf(value) === index)
}

const explicitNameToFile = {
  'Delivery Fee': 'DeliveryFee.png',
  'Matcha Cookie': 'MatchaCookie.png',
}

const buildPhotoSrcCandidates = item => {
  if (!item) return []
  const candidates = []

  if (item._id && item.photo) {
    candidates.push(`http://localhost:5000/api/menu/${item._id}/photo`)
  }
  if (typeof item.photo === 'string') {
    candidates.push(`http://localhost:5000/api/uploads/${item.photo}`)
  }
  if (item.photoUrl) {
    const photoUrl = item.photoUrl.startsWith('http')
      ? item.photoUrl
      : `http://localhost:5000${item.photoUrl}`
    candidates.push(photoUrl)
  }
  if (item.photo && item.photo.filename) {
    candidates.push(`http://localhost:5000/api/uploads/${item.photo.filename}`)
  }

  const override = explicitNameToFile[item.name?.trim()]
  if (override) {
    candidates.push(`http://localhost:5000/api/uploads/${encodeURIComponent(override)}`)
  }
  for (const name of buildMenuNameCandidates(item.name)) {
    candidates.push(`http://localhost:5000/api/uploads/${encodeURIComponent(name)}.png`)
    candidates.push(`http://localhost:5000/api/uploads/${encodeURIComponent(name)}.webp`)
  }
  return candidates
}

const buildPhotoSrc = item => buildPhotoSrcCandidates(item)[0] || null

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total } = useCart()
  const [open, setOpen] = useState(false)
  const [showOrder, setShowOrder] = useState(false)
  const [form, setForm] = useState({ name: '', contact: '', notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0)

  const handleOrder = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('/api/orders', {
        customer: form,
        items: cart.map(i => ({ name: i.name, price: i.price, qty: i.qty })),
        total,
      })
      setSubmitted(true)
      clearCart()
    } catch (err) {
      alert('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeAll = () => {
    setOpen(false)
    setShowOrder(false)
    setSubmitted(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Lato:wght@300;400;700&display=swap');

        :root {
          --brown-dark: #140d08;
          --brown-mid: #3b1f0e;
          --brown-light: #c47a2b;
          --gold: #d4940a;
          --cream: #f5ede0;
          --text-muted: #8b7355;
          --gradient-gold: linear-gradient(135deg, #c47a2b 0%, #d4940a 100%);
          --transition: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* ── Floating cart button ── */
        .cart-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.85rem 1.55rem;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: white;
          background: linear-gradient(135deg, #3b1f0e 0%, #140d08 100%);
          box-shadow: 0 8px 32px rgba(20,13,8,0.55), 0 2px 8px rgba(196,122,43,0.2);
          border: 1px solid rgba(196,122,43,0.25);
          transition: all 0.35s var(--transition);
        }
        .cart-fab:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 16px 40px rgba(20,13,8,0.6), 0 4px 16px rgba(196,122,43,0.35);
          border-color: rgba(196,122,43,0.5);
        }
        .cart-fab:active { transform: scale(0.97); }

        .cart-fab-badge {
          background: var(--gradient-gold);
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 900;
          box-shadow: 0 2px 8px rgba(196,122,43,0.5);
          animation: badgePop 0.3s var(--transition);
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }

        /* ── Overlay ── */
        .cart-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          justify-content: flex-end;
        }
        .cart-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10,5,2,0.72);
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

        /* ── Drawer ── */
        .cart-drawer {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #faf6f0;
          box-shadow: -12px 0 60px rgba(0,0,0,0.35);
          animation: slideIn 0.4s var(--transition);
          overflow: hidden;
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity:0.5 }
          to   { transform: translateX(0);   opacity:1 }
        }

        /* ── Drawer header ── */
        .cart-header {
          padding: 0;
          background: linear-gradient(145deg, #1e0f07 0%, #140d08 60%, #2a1508 100%);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-header::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(196,122,43,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .cart-header-inner {
          padding: 1.6rem 1.8rem 1.3rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 1;
        }
        .cart-header-title {
          font-family: 'Playfair Display', serif;
          color: white;
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .cart-header-sub {
          font-family: 'Lato', sans-serif;
          color: rgba(255,255,255,0.45);
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .cart-close-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.3rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          margin-top: 2px;
        }
        .cart-close-btn:hover {
          background: rgba(255,255,255,0.15);
          color: white;
          transform: rotate(90deg);
        }

        /* Gold divider line */
        .cart-header-line {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(196,122,43,0.6) 30%, rgba(212,148,10,0.8) 50%, rgba(196,122,43,0.6) 70%, transparent 100%);
          margin: 0 1.8rem 1.4rem;
          position: relative;
          z-index: 1;
        }

        /* ── Cart items area ── */
        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.2rem 1.6rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(196,122,43,0.3) transparent;
        }
        .cart-body::-webkit-scrollbar { width: 4px; }
        .cart-body::-webkit-scrollbar-track { background: transparent; }
        .cart-body::-webkit-scrollbar-thumb { background: rgba(196,122,43,0.35); border-radius: 2px; }

        /* ── Empty state ── */
        .cart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          height: 100%;
        }
        .cart-empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(196,122,43,0.1), rgba(196,122,43,0.05));
          border: 2px dashed rgba(196,122,43,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 1.4rem;
        }
        .cart-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          color: #3b1f0e;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .cart-empty-text {
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.7;
        }

        /* ── Cart item card ── */
        .cart-item {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(196,122,43,0.12);
          transition: background 0.2s ease;
        }
        .cart-item:last-child { border-bottom: none; }

        .cart-item-img {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0e8d8, #e8dcc8);
          flex-shrink: 0;
          border: 1px solid rgba(196,122,43,0.18);
          box-shadow: 0 2px 12px rgba(59,31,14,0.1);
        }
        .cart-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .cart-item-img:hover img { transform: scale(1.07); }
        .cart-item-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          opacity: 0.5;
        }

        .cart-item-info { flex: 1; min-width: 0; }
        .cart-item-name {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          color: #1e0f07;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cart-item-price {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1rem;
          color: var(--brown-light);
          letter-spacing: -0.01em;
        }

        /* ── Qty stepper ── */
        .qty-stepper {
          display: flex;
          align-items: center;
          gap: 0;
          background: white;
          border: 1.5px solid rgba(196,122,43,0.2);
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .qty-btn {
          width: 30px;
          height: 30px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brown-light);
          transition: background 0.2s ease;
          font-family: 'Lato', sans-serif;
        }
        .qty-btn:hover { background: rgba(196,122,43,0.08); }
        .qty-btn:active { background: rgba(196,122,43,0.16); }
        .qty-val {
          width: 28px;
          text-align: center;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.88rem;
          color: #1e0f07;
          pointer-events: none;
        }

        /* ── Remove btn ── */
        .cart-remove-btn {
          background: transparent;
          border: 1.5px solid rgba(200,50,50,0.15);
          color: rgba(180,50,50,0.7);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .cart-remove-btn:hover {
          background: rgba(200,50,50,0.08);
          border-color: rgba(200,50,50,0.4);
          color: #b91c1c;
          transform: scale(1.05);
        }

        /* ── Footer ── */
        .cart-footer {
          padding: 1.4rem 1.6rem 1.8rem;
          background: white;
          border-top: 1px solid rgba(196,122,43,0.15);
          box-shadow: 0 -8px 30px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }
        .cart-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.1rem;
        }
        .cart-total-label {
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .cart-total-amount {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #1e0f07;
          letter-spacing: -0.03em;
        }
        .cart-total-amount span {
          font-size: 1rem;
          color: var(--brown-light);
          margin-right: 2px;
        }

        .cart-proceed-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #c47a2b 0%, #d4940a 100%);
          border: none;
          border-radius: 14px;
          color: white;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(196,122,43,0.38);
          transition: all 0.35s var(--transition);
          position: relative;
          overflow: hidden;
        }
        .cart-proceed-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s ease;
        }
        .cart-proceed-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(196,122,43,0.48); }
        .cart-proceed-btn:hover::before { left: 100%; }
        .cart-proceed-btn:active { transform: translateY(0); }

        /* ── Order form ── */
        .order-form {
          flex: 1;
          overflow-y: auto;
          padding: 1.4rem 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-summary-card {
          background: linear-gradient(135deg, rgba(196,122,43,0.06), rgba(196,122,43,0.02));
          border: 1px solid rgba(196,122,43,0.18);
          border-radius: 14px;
          padding: 1.1rem 1.2rem;
          margin-bottom: 0.4rem;
        }
        .order-summary-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.8rem;
        }
        .order-summary-row {
          display: flex;
          justify-content: space-between;
          font-family: 'Lato', sans-serif;
          font-size: 0.88rem;
          color: #3b1f0e;
          margin-bottom: 0.35rem;
        }
        .order-summary-row span:last-child { font-weight: 700; }
        .order-summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(196,122,43,0.2);
          margin-top: 0.6rem;
          padding-top: 0.6rem;
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #1e0f07;
        }
        .order-summary-total span:last-child { color: var(--brown-light); }

        .form-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .form-input, .form-textarea {
          padding: 0.78rem 1rem;
          border: 1.5px solid rgba(196,122,43,0.18);
          border-radius: 10px;
          font-size: 0.9rem;
          font-family: 'Lato', sans-serif;
          outline: none;
          background: white;
          color: #1e0f07;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: var(--brown-light);
          box-shadow: 0 0 0 3px rgba(196,122,43,0.1);
        }
        .form-textarea { resize: vertical; min-height: 80px; }

        .form-actions {
          display: flex;
          gap: 0.8rem;
          margin-top: auto;
          padding-top: 0.4rem;
        }
        .form-back-btn {
          flex: 1;
          padding: 0.85rem;
          background: white;
          border: 1.5px solid rgba(196,122,43,0.22);
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }
        .form-back-btn:hover {
          border-color: var(--brown-light);
          color: var(--brown-light);
        }
        .form-submit-btn {
          flex: 2;
          padding: 0.85rem;
          background: linear-gradient(135deg, #1e0f07, #3b1f0e);
          border: none;
          border-radius: 12px;
          color: white;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(20,13,8,0.3);
          transition: all 0.3s ease;
        }
        .form-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(20,13,8,0.4);
        }
        .form-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Loading spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 0.4rem;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Success state ── */
        .cart-success {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .success-icon-wrap {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(196,122,43,0.12), rgba(196,122,43,0.05));
          border: 2px solid rgba(196,122,43,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.6rem;
          margin-bottom: 1.5rem;
          animation: successPop 0.5s var(--transition);
        }
        @keyframes successPop {
          from { transform: scale(0.5); opacity:0; }
          to   { transform: scale(1); opacity:1; }
        }
        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #1e0f07;
          letter-spacing: -0.02em;
          margin-bottom: 0.6rem;
        }
        .success-subtitle {
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.8;
          max-width: 260px;
          margin: 0 auto 1.8rem;
        }
        .success-back-btn {
          background: linear-gradient(135deg, #c47a2b 0%, #d4940a 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.85rem 2.2rem;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(196,122,43,0.35);
          transition: all 0.3s ease;
        }
        .success-back-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(196,122,43,0.45); }
      `}</style>

      {/* ── FLOATING BUTTON ── */}
      <button className="cart-fab" onClick={() => setOpen(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {totalItems > 0 && (
          <span className="cart-fab-badge">{totalItems}</span>
        )}
        Cart
      </button>

      {/* ── DRAWER ── */}
      {open && (
        <div className="cart-overlay">
          <div className="cart-backdrop" onClick={closeAll} />

          <div className="cart-drawer">

            {/* Header */}
            <div className="cart-header">
              <div className="cart-header-inner">
                <div>
                  <div className="cart-header-title">
                    {submitted ? 'Order Placed' : showOrder ? 'Your Order' : 'Your Cart'}
                  </div>
                  <div className="cart-header-sub">
                    {submitted ? 'See you soon!' : showOrder ? 'Review & confirm' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
                  </div>
                </div>
                <button className="cart-close-btn" onClick={closeAll}>×</button>
              </div>
              <div className="cart-header-line" />
            </div>

            {/* ── SUCCESS ── */}
            {submitted ? (
              <div className="cart-success">
                <div className="success-icon-wrap">☕</div>
                <div className="success-title">Order Received!</div>
                <p className="success-subtitle">
                  Thank you! Your order has been sent to our team. We'll have it ready for you shortly.
                </p>
                <button className="success-back-btn" onClick={closeAll}>
                  Back to Menu
                </button>
              </div>

            ) : showOrder ? (
              /* ── ORDER FORM ── */
              <form className="order-form" onSubmit={handleOrder}>
                <div className="order-summary-card">
                  <div className="order-summary-label">Order Summary</div>
                  {cart.map(i => (
                    <div className="order-summary-row" key={i._id}>
                      <span>{i.name} <span style={{color:'var(--text-muted)'}}>×{i.qty}</span></span>
                      <span>₱{i.price * i.qty}</span>
                    </div>
                  ))}
                  <div className="order-summary-total">
                    <span>Total</span>
                    <span>₱{total}</span>
                  </div>
                </div>

                {[
                  ['name', 'Your Name', 'text', 'e.g. Maria Santos'],
                  ['contact', 'Contact Number', 'text', 'e.g. 09171234567'],
                ].map(([name, label, type, placeholder]) => (
                  <div className="form-field" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={form[name]}
                      onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                ))}

                <div className="form-field">
                  <label className="form-label">Notes <span style={{opacity:0.5, fontWeight:400, textTransform:'none', letterSpacing:0}}>(optional)</span></label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any special requests or instructions?"
                    className="form-textarea"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="form-back-btn" onClick={() => setShowOrder(false)}>
                    ← Back
                  </button>
                  <button type="submit" className="form-submit-btn" disabled={loading}>
                    {loading ? <><span className="spinner" />Placing…</> : 'Place Order'}
                  </button>
                </div>
              </form>

            ) : (
              /* ── CART ITEMS ── */
              <>
                <div className="cart-body">
                  {cart.length === 0 ? (
                    <div className="cart-empty">
                      <div className="cart-empty-icon">🛒</div>
                      <div className="cart-empty-title">Nothing here yet</div>
                      <p className="cart-empty-text">
                        Add something from the menu<br />and we'll brew it right up.
                      </p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div className="cart-item" key={item._id}>
                        <div className="cart-item-img">
                          {buildPhotoSrc(item) ? (
                            <img
                              src={buildPhotoSrc(item)}
                              data-src-candidates={buildPhotoSrcCandidates(item).join('|')}
                              onError={e => {
                                const candidates = e.currentTarget.dataset.srcCandidates?.split('|') || []
                                const current = e.currentTarget.src
                                const index = candidates.findIndex(url => url === current)
                                if (index >= 0 && index < candidates.length - 1) {
                                  e.currentTarget.src = candidates[index + 1]
                                } else {
                                  e.currentTarget.onerror = null
                                }
                              }}
                              alt={item.name}
                            />
                          ) : (
                            <div className="cart-item-img-fallback">☕</div>
                          )}
                        </div>

                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">
                            <span style={{fontSize:'0.75rem', color:'var(--text-muted)', fontFamily:'Lato,sans-serif', fontWeight:400}}>₱</span>
                            {item.price * item.qty}
                          </div>
                        </div>

                        <div className="qty-stepper">
                          <button className="qty-btn" onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                          <span className="qty-val">{item.qty}</span>
                          <button className="qty-btn" onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                        </div>

                        <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)} title="Remove item">
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="cart-footer">
                    <div className="cart-total-row">
                      <span className="cart-total-label">Total</span>
                      <div className="cart-total-amount">
                        <span>₱</span>{total}
                      </div>
                    </div>
                    <button className="cart-proceed-btn" onClick={() => setShowOrder(true)}>
                      Proceed to Order →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}