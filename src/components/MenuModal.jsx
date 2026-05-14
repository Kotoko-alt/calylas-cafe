import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function MenuModal({ item, onClose }) {

  const { addToCart } = useCart()

  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {

    for (let i = 0; i < qty; i++) {
      addToCart(item)
    }

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 1000)
  }

  return (

    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: '1.2rem',
      }}
    >

      {/* BACKDROP */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,

          background:
            'rgba(10,8,6,0.72)',

          backdropFilter:
            'blur(14px)',
        }}
      />

      {/* MODAL */}
      <div
        style={{
          position: 'relative',

          width: '100%',
          maxWidth: 540,

          overflow: 'hidden',

          borderRadius: 30,

          background:
            'rgba(28,18,12,0.88)',

          backdropFilter:
            'blur(20px)',

          border:
            '1px solid rgba(255,255,255,0.08)',

          boxShadow:
            '0 30px 80px rgba(0,0,0,0.55)',

          animation:
            'modalShow .45s cubic-bezier(.16,1,.3,1)',
        }}
      >

        {/* CLOSE */}
        <button
          onClick={onClose}

          style={{
            position: 'absolute',
            top: 18,
            right: 18,

            width: 42,
            height: 42,

            border: 'none',
            borderRadius: '50%',

            background:
              'rgba(255,255,255,0.08)',

            color: 'white',

            fontSize: '1.2rem',
            cursor: 'pointer',

            zIndex: 20,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            backdropFilter:
              'blur(10px)',

            transition: 'all .3s ease',
          }}

          onMouseEnter={e => {
            e.currentTarget.style.transform =
              'scale(1.08) rotate(90deg)'

            e.currentTarget.style.background =
              'rgba(255,255,255,0.14)'
          }}

          onMouseLeave={e => {
            e.currentTarget.style.transform =
              'scale(1) rotate(0deg)'

            e.currentTarget.style.background =
              'rgba(255,255,255,0.08)'
          }}
        >
          ×
        </button>

        {/* IMAGE */}
        <div
          style={{
            height: 320,
            overflow: 'hidden',
            position: 'relative',
          }}
        >

          {item.photo ? (

            <img
              src={`http://localhost:5000/api/uploads/${item.photo}`}
              alt={item.name}

              style={{
                width: '100%',
                height: '100%',

                objectFit: 'cover',
              }}
            />

          ) : (

            <div
              style={{
                width: '100%',
                height: '100%',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                fontSize: '6rem',

                background:
                  'linear-gradient(135deg,#3b2417,#1a120d)',

                color: '#c47a2b',
              }}
            >
              ☕
            </div>

          )}

          {/* IMAGE OVERLAY */}
          <div
            style={{
              position: 'absolute',
              inset: 0,

              background:
                'linear-gradient(to top, rgba(12,8,5,0.92), rgba(12,8,5,0.1))',
            }}
          />
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: '2rem',
            marginTop: '-40px',
            position: 'relative',
            zIndex: 2,
          }}
        >

          {/* CATEGORY */}
          {item.category && (

            <span
              style={{
                display: 'inline-flex',

                background:
                  'rgba(196,122,43,0.18)',

                color: '#e7b16d',

                padding: '0.45rem 1rem',

                borderRadius: 999,

                border:
                  '1px solid rgba(196,122,43,0.25)',

                fontSize: '0.72rem',
                fontWeight: 700,

                letterSpacing: '0.14em',
                textTransform: 'uppercase',

                backdropFilter:
                  'blur(10px)',
              }}
            >
              {item.category}
            </span>

          )}

          {/* NAME + PRICE */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',

              gap: '1rem',

              marginTop: '1rem',
            }}
          >

            <h2
              style={{
                fontFamily:
                  'Playfair Display, serif',

                color: 'white',

                fontSize: '2rem',
                fontWeight: 800,

                lineHeight: 1.1,

                letterSpacing: '-0.03em',

                flex: 1,
              }}
            >
              {item.name}
            </h2>

            <div
              style={{
                fontFamily:
                  'Playfair Display, serif',

                color: '#d89b52',

                fontSize: '1.8rem',
                fontWeight: 700,

                whiteSpace: 'nowrap',
              }}
            >
              ₱{item.price}
            </div>

          </div>

          {/* DESCRIPTION */}
          {item.description && (

            <p
              style={{
                marginTop: '1rem',

                color:
                  'rgba(255,255,255,0.68)',

                lineHeight: 1.8,

                fontSize: '0.95rem',
              }}
            >
              {item.description}
            </p>

          )}

          {/* ACTIONS */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',

              alignItems: 'center',

              marginTop: '2rem',
            }}
          >

            {/* QTY */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',

                gap: '1rem',

                padding: '0.5rem',

                borderRadius: 18,

                background:
                  'rgba(255,255,255,0.06)',

                border:
                  '1px solid rgba(255,255,255,0.05)',
              }}
            >

              <button
                onClick={() =>
                  setQty(q => Math.max(1, q - 1))
                }

                style={qtyButtonStyle}
              >
                −
              </button>

              <span
                style={{
                  color: 'white',

                  fontWeight: 700,
                  fontSize: '1rem',

                  minWidth: 20,
                  textAlign: 'center',
                }}
              >
                {qty}
              </span>

              <button
                onClick={() =>
                  setQty(q => q + 1)
                }

                style={{
                  ...qtyButtonStyle,

                  background:
                    'var(--gradient-gold)',

                  color: 'white',
                }}
              >
                +
              </button>

            </div>

            {/* ADD BUTTON */}
            <button
              onClick={handleAdd}

              style={{
                flex: 1,

                height: 56,

                border: 'none',
                borderRadius: 18,

                cursor: 'pointer',

                background: added
                  ? '#22C55E'
                  : 'var(--gradient-gold)',

                color: 'white',

                fontWeight: 800,
                fontSize: '0.88rem',

                letterSpacing: '0.12em',
                textTransform: 'uppercase',

                boxShadow:
                  '0 16px 35px rgba(196,122,43,0.35)',

                transition:
                  'all .35s cubic-bezier(.16,1,.3,1)',
              }}

              onMouseEnter={e => {
                e.currentTarget.style.transform =
                  'translateY(-3px) scale(1.02)'
              }}

              onMouseLeave={e => {
                e.currentTarget.style.transform =
                  'translateY(0) scale(1)'
              }}
            >
              {added
                ? '✓ Added!'
                : `Add to Cart · ₱${item.price * qty}`
              }
            </button>

          </div>

        </div>

      </div>

      <style>{`

        @keyframes modalShow {

          from {
            opacity: 0;
            transform:
              translateY(40px)
              scale(.95);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }

        }

      `}</style>

    </div>
  )
}

const qtyButtonStyle = {

  width: 38,
  height: 38,

  border: 'none',
  borderRadius: '50%',

  background:
    'rgba(255,255,255,0.08)',

  color: 'white',

  fontSize: '1.2rem',
  fontWeight: 700,

  cursor: 'pointer',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  transition: 'all .3s ease',
}