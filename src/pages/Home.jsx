import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/menu')
      .then(res => setMenuItems(res.data))
      .catch(() => setMenuItems([]))
      .finally(() => setLoading(false))
  }, [])

  const grouped = menuItems.reduce((groups, item) => {
    const cat = item.category || 'Others'
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(item)
    return groups
  }, {})

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section id="hero" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--brown-dark) 0%, var(--brown-main) 50%, var(--brown-mid) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '2rem',
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(196,122,43,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ textAlign: 'center', zIndex: 1, maxWidth: 700 }}>
          <img src="/logo.jpg" alt="Calyla's Café Logo" style={{
            width: 100, height: 100, borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            margin: '0 auto 1.5rem',
            display: 'block',
          }} />
          <p style={{ color: 'var(--brown-light)', letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: 700 }}>
            Est. 2022 · Villaverde, Nueva Vizcaya
          </p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--cream)', fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Calyla's<br />Café
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.75)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 2rem' }}>
            Your cozy local café in the heart of Villaverde — serving handcrafted coffee, refreshing drinks, and warm moments.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#menu" style={{
              background: 'var(--brown-light)', color: 'white',
              padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>View Menu</a>
            <a href="#about" style={{
              border: '2px solid rgba(245,237,216,0.5)', color: 'var(--cream)',
              padding: '0.8rem 2rem', borderRadius: '6px', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Our Story</a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: '6rem 2rem', background: 'var(--cream-light)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--brown-light)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem' }}>Our Story</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--brown-dark)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              A Cup of Love<br />From Villaverde
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
              Calyla's Café opened its doors in 2022 with a simple dream — to bring café-quality drinks to the community of Villaverde, Nueva Vizcaya. What started as a passion for coffee grew into a beloved local gathering place.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Every cup we serve is crafted with care, using quality ingredients to create flavors that feel like home. From our signature lattes to our refreshing fruit sodas, there's something for everyone at Calyla's.
            </p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              {[['2022', 'Est.'], ['62+', 'Menu Items'], ['10AM–7:30PM', 'Daily']].map(([val, label]) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color: 'var(--brown-main)' }}>{val}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, var(--brown-main), var(--brown-dark))',
            borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', color: 'var(--cream)',
            boxShadow: '0 20px 60px rgba(59,31,14,0.25)',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☕</div>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: 1.6 }}>
              "Life happens, coffee helps."
            </p>
            <div style={{ height: 2, background: 'rgba(196,122,43,0.4)', width: '60%', margin: '1.5rem auto 0' }} />
            <p style={{ marginTop: '1rem', color: 'var(--brown-light)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Calyla's Café</p>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" style={{ padding: '6rem 2rem', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--brown-light)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>What We Serve</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--brown-dark)', marginBottom: '1rem' }}>Our Menu</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>From bold espressos to creamy frappuccinos — find your perfect drink.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading menu...</div>
          ) : menuItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No menu items yet. Check back soon! ☕</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} style={{ marginBottom: '3.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--brown-light)', opacity: 0.3 }} />
                  <h3 style={{
                    background: 'var(--brown-light)',
                    color: 'white',
                    padding: '0.4rem 1.5rem',
                    borderRadius: '30px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>{category}</h3>
                  <div style={{ flex: 1, height: 1, background: 'var(--brown-light)', opacity: 0.3 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
                  {items.map(item => <MenuCard key={item._id} item={item} />)}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" style={{ padding: '6rem 2rem', background: 'var(--cream-light)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: 'var(--brown-light)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>Find Us</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--brown-dark)' }}>Location & Hours</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(59,31,14,0.08)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown-dark)', fontSize: '1.3rem', marginBottom: '1.2rem' }}>Visit Us</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '0.8rem' }}>📍 P-1 Ibung, Villaverde, Nueva Vizcaya</p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>📞 0965 779 5858</p>
              <a href="https://www.facebook.com/bycalyla" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-block', background: '#1877F2', color: 'white',
                padding: '0.6rem 1.5rem', borderRadius: '6px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.85rem', marginTop: '0.5rem'
              }}>Facebook Page</a>
            </div>
            <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(59,31,14,0.08)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown-dark)', fontSize: '1.3rem', marginBottom: '1.2rem' }}>Store Hours</h3>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--cream)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{day}</span>
                  <span style={{ color: 'var(--brown-light)', fontWeight: 700 }}>10:00 AM – 7:30 PM</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ background: 'var(--brown-dark)', color: 'var(--cream)', padding: '4rem 2rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', marginBottom: '0.8rem' }}>Calyla's Café</h3>
              <p style={{ color: 'rgba(245,237,216,0.65)', lineHeight: 1.7, fontSize: '0.9rem' }}>Your cozy coffee spot in Villaverde, Nueva Vizcaya. Crafted with love since 2022.</p>
            </div>
            <div>
              <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem', fontSize: '1.1rem' }}>Quick Links</h4>
              {[['#about','About Us'],['#menu','Menu'],['#location','Location']].map(([href, label]) => (
                <a key={href} href={href} style={{ display: 'block', color: 'rgba(245,237,216,0.65)', textDecoration: 'none', marginBottom: '0.5rem', fontSize: '0.9rem' }}
                onMouseEnter={e => e.target.style.color = 'var(--brown-light)'}
                onMouseLeave={e => e.target.style.color = 'rgba(245,237,216,0.65)'}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem', fontSize: '1.1rem' }}>Follow Us</h4>
              <a href="https://www.facebook.com/bycalyla" target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                background: '#1877F2', color: 'white',
                padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.85rem',
              }}>📘 Facebook</a>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(245,237,216,0.12)', paddingTop: '1.5rem', textAlign: 'center', color: 'rgba(245,237,216,0.4)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} Calyla's Café · Villaverde, Nueva Vizcaya
          </div>
        </div>
      </footer>

      <Cart />
    </div>
  )
}