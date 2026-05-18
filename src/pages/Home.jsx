import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import MenuCard from '../components/MenuCard'
import Cart from '../components/Cart'

export default function Home() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredIndex, setFeaturedIndex] = useState(0)

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/menu')
      .then((res) => {
        console.log(res.data)
        setMenuItems(res.data)
      })
      .catch((err) => {
        console.error(err)
        setMenuItems([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Others'))]

  const filteredMenuItems = menuItems.filter(item => {
    const category = item.category || 'Others'
    const matchesCategory = filterCategory === 'All' || category === filterCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

  const buildMenuPhotoSrcCandidates = item => {
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

  const buildMenuPhotoSrc = item => buildMenuPhotoSrcCandidates(item)[0] || null

  const handleImgError = e => {
    const candidates = e.currentTarget.dataset.srcCandidates?.split('|') || []
    const current = e.currentTarget.src
    const index = candidates.findIndex(url => url === current)
    if (index >= 0 && index < candidates.length - 1) {
      e.currentTarget.src = candidates[index + 1]
    } else {
      e.currentTarget.onerror = null
    }
  }

  const [featuredIsAnimating, setFeaturedIsAnimating] = useState(false)
  const featuredMenuItems = menuItems.filter(item => buildMenuPhotoSrc(item))
  const featuredMenuItem = featuredMenuItems[featuredIndex] || menuItems[0] || null

  const advanceFeatured = () => {
    if (!featuredMenuItems.length) return
    setFeaturedIsAnimating(true)
    setFeaturedIndex(current => (current + 1) % featuredMenuItems.length)
    window.setTimeout(() => setFeaturedIsAnimating(false), 340)
  }

  useEffect(() => {
    if (featuredMenuItems.length <= 1) return
    const interval = window.setInterval(() => {
      advanceFeatured()
    }, 6000)
    return () => window.clearInterval(interval)
  }, [featuredMenuItems.length])

  useEffect(() => {
    if (featuredIndex >= featuredMenuItems.length) {
      setFeaturedIndex(0)
    }
  }, [featuredIndex, featuredMenuItems.length])

  const handleNextFeatured = () => {
    advanceFeatured()
  }

  const grouped = filteredMenuItems.reduce((groups, item) => {
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
        backgroundImage: `linear-gradient(180deg, rgba(9,9,9,0.92) 0%, rgba(9,9,9,0.62) 30%, rgba(9,9,9,0.85) 100%), url('http://localhost:5000/api/uploads/hero.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '2rem',
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(196,122,43,0.14)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-4%', width: 520, height: 520, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', width: '100%', maxWidth: 1240, gap: '2.5rem', alignItems: 'center', justifyContent: 'space-between', padding: '4rem 0', zIndex: 1 }}>
          <div style={{ flex: '0 0 520px', minWidth: 300, textAlign: 'left' }}>
            <img src="/logo.jpg" alt="Calyla's Café Logo" style={{
              width: 100, height: 100, borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 8px 32px rgba(0,0,0,0.32)',
              marginBottom: '1.5rem',
              display: 'block',
            }} />
            <p style={{ color: 'rgba(255,218,165,0.9)', letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: 700 }}>
              Est. 2022 · Villaverde, Nueva Vizcaya
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: 'clamp(3rem, 6vw, 5.2rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.2rem' }}>
              Calyla's<br />Café
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: 520, margin: '0 0 2rem' }}>
              A cozy corner for handcrafted coffee, sweet pastries, and warm moments in Villaverde.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#menu" style={{
                background: 'rgba(255,214,150,0.96)', color: '#2d1c09',
                padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                boxShadow: '0 18px 32px rgba(0,0,0,0.18)',
              }}>View Menu</a>
              <a href="#about" style={{
                border: '1px solid rgba(255,255,255,0.35)', color: 'rgba(255,255,255,0.95)',
                padding: '0.9rem 2rem', borderRadius: '999px', textDecoration: 'none',
                fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.08)',
              }}>Our Story</a>
            </div>
          </div>
          <div style={{ flex: '1 1 420px', minWidth: 320 }}>
            <div style={{ borderRadius: 32, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 34px 100px rgba(0,0,0,0.22)', backdropFilter: 'blur(16px)', transition: 'transform 0.35s ease, opacity 0.35s ease', transform: featuredIsAnimating ? 'scale(0.98)' : 'scale(1)', opacity: featuredIsAnimating ? 0.9 : 1 }}>
              <div style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
                <img
                  src={buildMenuPhotoSrc(featuredMenuItem) || 'http://localhost:5000/api/uploads/hero.webp'}
                  data-src-candidates={buildMenuPhotoSrcCandidates(featuredMenuItem).join('|')}
                  onError={handleImgError}
                  alt={featuredMenuItem ? featuredMenuItem.name : 'Featured coffee'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.92) contrast(1.05)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.72) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: 'white' }}>
                  <div style={{ textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.78rem', opacity: 0.88, marginBottom: '0.6rem' }}>{featuredMenuItem ? featuredMenuItem.category || 'Menu Item' : 'Featured delight'}</div>
                  <h3 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.05, fontWeight: 800 }}>{featuredMenuItem ? featuredMenuItem.name : 'Caramel Almond Pastry'}</h3>
                  <p style={{ margin: '1rem 0 1.3rem', color: 'rgba(255,255,255,0.82)', fontSize: '0.95rem', lineHeight: 1.6 }}>{featuredMenuItem ? featuredMenuItem.description || 'A delicious menu selection made fresh daily.' : 'Warm pastry topped with toasted almonds and a swirl of rich caramel.'}</p>
                  <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <a href="#menu" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 1.5rem', background: 'rgba(255,214,150,0.96)', color: '#2d1c09', borderRadius: '999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>View menu</a>
                    <button onClick={handleNextFeatured} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 1.25rem', background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '999px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'transform 0.2s ease' }}>Next</button>
                  </div>
                  {featuredMenuItems.length > 1 && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', opacity: 0.88 }}>
                      {featuredMenuItem ? `${featuredMenuItem.category || 'Menu'} • ${featuredIndex + 1} of ${featuredMenuItems.length}` : `Showing ${featuredIndex + 1} of ${featuredMenuItems.length}`}
                    </div>
                  )}
                </div>
              </div>
            </div>
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
            position: 'relative',
            borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', color: 'var(--cream)',
            boxShadow: '0 20px 60px rgba(59,31,14,0.25)',
            backgroundImage: 'linear-gradient(135deg, rgba(89,45,18,0.98), rgba(44,22,12,0.95))',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.16)', borderRadius: 16 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☕</div>
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: 1.6 }}>
                "Life happens, coffee helps."
              </p>
              <div style={{ height: 2, background: 'rgba(196,122,43,0.4)', width: '60%', margin: '1.5rem auto 0' }} />
              <p style={{ marginTop: '1rem', color: 'var(--brown-light)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Calyla's Café</p>
            </div>
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
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 220 }}>
                  <span style={{ color: 'var(--brown-dark)', fontWeight: 700 }}>Filter by category</span>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem',
                      borderRadius: 16,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'white',
                      color: 'var(--brown-dark)',
                      outline: 'none',
                    }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 220, flex: 1, maxWidth: 360 }}>
                  <span style={{ color: 'var(--brown-dark)', fontWeight: 700 }}>Search menu</span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name..."
                    style={{
                      width: '100%',
                      padding: '0.9rem 1rem',
                      borderRadius: 16,
                      border: '1px solid rgba(0,0,0,0.1)',
                      background: 'white',
                      color: 'var(--brown-dark)',
                      outline: 'none',
                    }}
                  />
                </label>
              </div>

              {filteredMenuItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No menu items match that filter.</p>
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
            </>
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
            <figure style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(59,31,14,0.08)', overflow: 'hidden', minHeight: 260 }}>
              <iframe
                title="Calyla's Café Location"
                src="https://www.google.com/maps?q=calylas+cafe+villaverde+nueva+vizcaya&output=embed"
                width="100%"
                height="260"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
              />
              <figcaption style={{ padding: '1rem 1.2rem', background: '#fafafa', color: '#4d4d4d', fontSize: '0.95rem', textAlign: 'center' }}>
                View Calyla's Café on Google Maps directly in the page.
              </figcaption>
            </figure>
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