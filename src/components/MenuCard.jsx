import { useState } from 'react'
import MenuModal from './MenuModal'

export default function MenuCard({ item }) {
  const [showModal, setShowModal] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Lato:wght@300;400;700;900&display=swap');

        .menu-card {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(59,31,14,0.09);
          border: 1px solid rgba(196,122,43,0.1);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94),
                      box-shadow 0.35s cubic-bezier(0.25,0.46,0.45,0.94),
                      border-color 0.35s ease;
          position: relative;
        }
        .menu-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(59,31,14,0.18), 0 4px 12px rgba(196,122,43,0.12);
          border-color: rgba(196,122,43,0.28);
        }

        /* ── Image area ── */
        .menu-card-img-wrap {
          height: 210px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0e8d8, #e8dcc8);
          position: relative;
          flex-shrink: 0;
        }
        .menu-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
          display: block;
        }
        .menu-card:hover .menu-card-img {
          transform: scale(1.07);
        }
        .menu-card-img-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          opacity: 0.45;
        }

        /* Category badge (top-left) */
        .menu-card-category {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(20,13,8,0.72);
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.85);
          font-family: 'Lato', sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 0.28rem 0.65rem;
          border-radius: 50px;
          border: 1px solid rgba(196,122,43,0.3);
        }

        /* Image overlay on hover */
        .menu-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(20,13,8,0.1) 0%, rgba(59,31,14,0.55) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .menu-card:hover .menu-card-overlay {
          opacity: 1;
        }
        .menu-card-overlay-pill {
          color: white;
          font-family: 'Lato', sans-serif;
          font-weight: 800;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          background: rgba(196,122,43,0.85);
          backdrop-filter: blur(6px);
          padding: 0.55rem 1.4rem;
          border-radius: 50px;
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 4px 16px rgba(196,122,43,0.4);
          transform: translateY(6px);
          transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .menu-card:hover .menu-card-overlay-pill {
          transform: translateY(0);
        }

        /* Gradient bleed from image into card body */
        .menu-card-img-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: linear-gradient(to top, white, transparent);
          pointer-events: none;
        }

        /* ── Card body ── */
        .menu-card-body {
          padding: 1.1rem 1.2rem 1.3rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .menu-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.6rem;
        }

        .menu-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #1e0f07;
          line-height: 1.25;
          letter-spacing: -0.01em;
          flex: 1;
        }

        .menu-card-price {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #c47a2b 0%, #d4940a 100%);
          padding: 0.22rem 0.72rem;
          border-radius: 50px;
          white-space: nowrap;
          letter-spacing: -0.01em;
          box-shadow: 0 3px 10px rgba(196,122,43,0.3);
          flex-shrink: 0;
        }
        .menu-card-price-symbol {
          font-size: 0.7rem;
          opacity: 0.85;
          font-family: 'Lato', sans-serif;
          font-weight: 700;
          margin-right: 1px;
        }

        .menu-card-desc {
          font-family: 'Lato', sans-serif;
          color: #8b7355;
          font-size: 0.8rem;
          line-height: 1.55;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Bottom CTA ── */
        .menu-card-cta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.1rem;
          font-family: 'Lato', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--brown-light, #c47a2b);
          transition: gap 0.25s ease;
        }
        .menu-card:hover .menu-card-cta {
          gap: 0.65rem;
        }
        .menu-card-cta-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          background: linear-gradient(135deg, rgba(196,122,43,0.12), rgba(196,122,43,0.06));
          border: 1px solid rgba(196,122,43,0.25);
          border-radius: 50%;
          font-size: 0.75rem;
          transition: background 0.25s ease, transform 0.25s ease;
        }
        .menu-card:hover .menu-card-cta-arrow {
          background: linear-gradient(135deg, rgba(196,122,43,0.22), rgba(196,122,43,0.12));
          transform: translateX(2px);
        }

        /* Thin gold accent bar at the very bottom of the card */
        .menu-card-accent {
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(196,122,43,0.5), rgba(212,148,10,0.7), rgba(196,122,43,0.5), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
          flex-shrink: 0;
        }
        .menu-card:hover .menu-card-accent {
          opacity: 1;
        }
      `}</style>

      <div
        className="menu-card"
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* IMAGE */}
        <div className="menu-card-img-wrap">
          {item.photo ? (
            <img
              src={`http://localhost:5000/api/uploads/${item.photo}`}
              alt={item.name}
              className="menu-card-img"
            />
          ) : (
            <div className="menu-card-img-fallback">☕</div>
          )}

          {item.category && (
            <div className="menu-card-category">{item.category}</div>
          )}

          <div className="menu-card-overlay">
            <span className="menu-card-overlay-pill">View Item</span>
          </div>

          <div className="menu-card-img-fade" />
        </div>

        {/* BODY */}
        <div className="menu-card-body">
          <div className="menu-card-top">
            <h3 className="menu-card-name">{item.name}</h3>
            <div className="menu-card-price">
              <span className="menu-card-price-symbol">₱</span>
              {item.price}
            </div>
          </div>

          {item.description && (
            <p className="menu-card-desc">{item.description}</p>
          )}

          <div className="menu-card-cta">
            Tap to order
            <span className="menu-card-cta-arrow">→</span>
          </div>
        </div>

        {/* Bottom gold shimmer */}
        <div className="menu-card-accent" />
      </div>

      {showModal && <MenuModal item={item} onClose={() => setShowModal(false)} />}
    </>
  )
}