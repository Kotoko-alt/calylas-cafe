import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {

  const [scrolled, setScrolled] =
    useState(false)

  const [active, setActive] =
    useState('#hero')

  useEffect(() => {

    const onScroll = () => {

      setScrolled(window.scrollY > 40)

      const sections = [
        '#hero',
        '#about',
        '#menu',
        '#location',
        '#contact',
      ]

      sections.forEach(id => {

        const el =
          document.querySelector(id)

        if (!el) return

        const top =
          el.offsetTop - 140

        const bottom =
          top + el.offsetHeight

        if (
          window.scrollY >= top &&
          window.scrollY < bottom
        ) {
          setActive(id)
        }

      })

    }

    window.addEventListener(
      'scroll',
      onScroll
    )

    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      )

  }, [])

  const navLinks = [
    {
      label: 'Home',
      href: '#hero',
    },
    {
      label: 'About',
      href: '#about',
    },
    {
      label: 'Menu',
      href: '#menu',
    },
    {
      label: 'Location',
      href: '#location',
    },
    {
      label: 'Contact',
      href: '#contact',
    },
  ]

  return (

    <nav
      style={{
        position: 'fixed',

        top: 20,
        left: '50%',

        transform:
          'translateX(-50%)',

        width:
          'calc(100% - 32px)',

        maxWidth: 1380,

        zIndex: 99999,

        display: 'flex',

        alignItems: 'center',

        justifyContent:
          'space-between',

        padding:
          '0 1.5rem',

        height: 82,

        borderRadius: 28,

        background: scrolled
          ? 'rgba(17,11,8,0.82)'
          : 'rgba(17,11,8,0.45)',

        backdropFilter:
          'blur(20px)',

        WebkitBackdropFilter:
          'blur(20px)',

        border: scrolled
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(255,255,255,0.05)',

        boxShadow: scrolled
          ? `
            0 20px 50px rgba(0,0,0,0.28),
            0 0 0 1px rgba(255,255,255,0.02)
          `
          : 'none',

        transition:
          'all .4s cubic-bezier(.16,1,.3,1)',
      }}
    >

      {/* LEFT */}
      <a
        href="#hero"

        style={{
          display: 'flex',

          alignItems: 'center',

          gap: '1rem',

          textDecoration: 'none',

          flexShrink: 0,
        }}
      >

        {/* LOGO */}
        <div
          style={{
            position: 'relative',
          }}
        >

          <div
            style={{
              position: 'absolute',
              inset: -8,

              borderRadius: '50%',

              background:
                'rgba(196,122,43,0.18)',

              filter: 'blur(18px)',
            }}
          />

          <img
            src="/logo.jpg"
            alt="Calyla's Café"

            style={{
              position: 'relative',

              width: 52,
              height: 52,

              borderRadius: '50%',

              objectFit: 'cover',

              border:
                '2px solid rgba(196,122,43,0.55)',

              boxShadow:
                '0 10px 30px rgba(196,122,43,0.25)',
            }}
          />

        </div>

        {/* TEXT */}
        <div>

          <div
            style={{
              fontFamily:
                'Playfair Display, serif',

              color: 'white',

              fontWeight: 800,

              fontSize: '1.05rem',

              letterSpacing: '-0.03em',

              lineHeight: 1,
            }}
          >
            Calyla's Café
          </div>

          <div
            style={{
              color:
                'rgba(255,255,255,0.5)',

              fontSize: '0.64rem',

              letterSpacing: '0.22em',

              textTransform:
                'uppercase',

              marginTop: 5,
            }}
          >
            Villaverde · Nueva Vizcaya
          </div>

        </div>

      </a>

      {/* CENTER */}
      <ul
        style={{
          display: 'flex',

          alignItems: 'center',

          gap: '0.5rem',

          listStyle: 'none',

          margin: 0,
          padding: 0,
        }}
      >

        {navLinks.map(link => {

          const isActive =
            active === link.href

          return (

            <li key={link.href}>

              <a
                href={link.href}

                style={{
                  position: 'relative',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  height: 44,

                  padding:
                    '0 1.1rem',

                  borderRadius: 14,

                  textDecoration:
                    'none',

                  color: isActive
                    ? '#fff'
                    : 'rgba(255,255,255,0.68)',

                  background: isActive
                    ? 'rgba(255,255,255,0.06)'
                    : 'transparent',

                  fontSize: '0.78rem',

                  fontWeight: 700,

                  letterSpacing: '0.12em',

                  textTransform:
                    'uppercase',

                  transition:
                    'all .3s cubic-bezier(.16,1,.3,1)',

                  cursor: 'pointer',
                }}

                onMouseEnter={e => {

                  e.currentTarget.style.color =
                    '#fff'

                  e.currentTarget.style.background =
                    'rgba(255,255,255,0.06)'
                }}

                onMouseLeave={e => {

                  if (!isActive) {

                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.68)'

                    e.currentTarget.style.background =
                      'transparent'
                  }

                }}
              >

                {isActive && (

                  <div
                    style={{
                      position: 'absolute',

                      bottom: 6,

                      width: 18,
                      height: 2,

                      borderRadius: 999,

                      background:
                        '#D89B52',
                    }}
                  />

                )}

                {link.label}

              </a>

            </li>

          )

        })}

      </ul>

      {/* RIGHT */}
      <Link
        to="/login"

        style={{
          position: 'relative',

          overflow: 'hidden',

          background:
            'linear-gradient(135deg,#C47A2B,#A86420)',

          color: 'white',

          height: 50,

          padding:
            '0 1.7rem',

          borderRadius: 18,

          textDecoration: 'none',

          display: 'flex',

          alignItems: 'center',
          justifyContent: 'center',

          fontSize: '0.78rem',

          fontWeight: 800,

          letterSpacing: '0.12em',

          textTransform:
            'uppercase',

          boxShadow:
            '0 16px 40px rgba(196,122,43,0.35)',

          transition:
            'all .35s cubic-bezier(.16,1,.3,1)',
        }}

        onMouseEnter={e => {

          e.currentTarget.style.transform =
            'translateY(-4px) scale(1.03)'

          e.currentTarget.style.boxShadow =
            '0 22px 50px rgba(196,122,43,0.45)'
        }}

        onMouseLeave={e => {

          e.currentTarget.style.transform =
            'translateY(0px) scale(1)'

          e.currentTarget.style.boxShadow =
            '0 16px 40px rgba(196,122,43,0.35)'
        }}
      >
        Admin
      </Link>

    </nav>

  )
}