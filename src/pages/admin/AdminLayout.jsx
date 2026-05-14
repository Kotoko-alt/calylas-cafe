import {
  Outlet,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {

  const { user, logout } = useAuth()

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const allNavItems = [

    {
      label: '🍽️ Menu Management',
      path: '/admin/menu',
    },

    {
      label: '📦 Orders',
      path: '/admin/orders',
    },

    {
      label: '👥 User Management',
      path: '/admin/users',
      adminOnly: true,
    },

  ]

  const navItems = allNavItems.filter(
    item =>
      !item.adminOnly ||
      user?.role === 'admin'
  )

  return (

    <div
      style={{
        minHeight: '100vh',

        background:
          'linear-gradient(135deg, #120b08 0%, #1c120d 40%, #24160f 100%)',

        display: 'flex',
      }}
    >

      {/* SIDEBAR */}
      <aside
        style={{
          width: 290,

          position: 'fixed',
          top: 18,
          left: 18,
          bottom: 18,

          zIndex: 100,

          borderRadius: 30,

          overflow: 'hidden',

          background:
            'rgba(24,15,10,0.82)',

          backdropFilter:
            'blur(22px)',

          border:
            '1px solid rgba(255,255,255,0.06)',

          boxShadow:
            '0 20px 60px rgba(0,0,0,0.45)',

          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* GLOW */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -100,

            width: 260,
            height: 260,

            borderRadius: '50%',

            background:
              'rgba(196,122,43,0.12)',

            filter: 'blur(80px)',
          }}
        />

        {/* HEADER */}
        <div
          style={{
            position: 'relative',

            padding:
              '2rem 1.6rem 1.5rem',

            borderBottom:
              '1px solid rgba(255,255,255,0.06)',
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >

            <img
              src="/logo.jpg"
              alt="Calyla's Café"

              style={{
                width: 54,
                height: 54,

                borderRadius: '50%',

                objectFit: 'cover',

                border:
                  '2px solid rgba(196,122,43,0.6)',

                boxShadow:
                  '0 8px 25px rgba(196,122,43,0.35)',

                animation:
                  'floatLogo 5s ease-in-out infinite',
              }}
            />

            <div>

              <div
                style={{
                  fontFamily:
                    'Playfair Display, serif',

                  color: 'white',

                  fontWeight: 800,
                  fontSize: '1.15rem',

                  letterSpacing: '-0.03em',
                }}
              >
                Calyla's Café
              </div>

              <div
                style={{
                  color:
                    'rgba(196,122,43,0.78)',

                  fontSize: '0.68rem',

                  textTransform: 'uppercase',

                  letterSpacing: '0.18em',

                  marginTop: 4,
                }}
              >
                Premium Admin Panel
              </div>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}
        <nav
          style={{
            flex: 1,

            padding:
              '1.5rem 1rem',
          }}
        >

          {navItems.map(item => {

            const isActive =
              location.pathname === item.path

            return (

              <Link
                key={item.path}
                to={item.path}

                style={{
                  position: 'relative',

                  display: 'flex',
                  alignItems: 'center',

                  padding:
                    '1rem 1.1rem',

                  marginBottom: '0.8rem',

                  borderRadius: 18,

                  textDecoration: 'none',

                  overflow: 'hidden',

                  background: isActive
                    ? 'rgba(196,122,43,0.14)'
                    : 'transparent',

                  border: isActive
                    ? '1px solid rgba(196,122,43,0.18)'
                    : '1px solid transparent',

                  color: isActive
                    ? '#f4d2a7'
                    : 'rgba(255,255,255,0.58)',

                  fontWeight:
                    isActive ? 700 : 500,

                  fontSize: '0.92rem',

                  letterSpacing: '0.02em',

                  transition:
                    'all .35s cubic-bezier(.16,1,.3,1)',
                }}

                onMouseEnter={e => {

                  if (!isActive) {

                    e.currentTarget.style.background =
                      'rgba(255,255,255,0.05)'

                    e.currentTarget.style.transform =
                      'translateX(6px)'

                    e.currentTarget.style.color =
                      'white'
                  }

                }}

                onMouseLeave={e => {

                  if (!isActive) {

                    e.currentTarget.style.background =
                      'transparent'

                    e.currentTarget.style.transform =
                      'translateX(0px)'

                    e.currentTarget.style.color =
                      'rgba(255,255,255,0.58)'
                  }

                }}
              >

                {isActive && (

                  <div
                    style={{
                      position: 'absolute',

                      left: 0,
                      top: 10,
                      bottom: 10,

                      width: 4,

                      borderRadius: 999,

                      background:
                        'var(--gradient-gold)',
                    }}
                  />

                )}

                {item.label}

              </Link>

            )

          })}

        </nav>

        {/* FOOTER */}
        <div
          style={{
            padding: '1.5rem',

            borderTop:
              '1px solid rgba(255,255,255,0.06)',
          }}
        >

          {/* USER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',

              gap: '0.9rem',

              marginBottom: '1.2rem',
            }}
          >

            <div
              style={{
                width: 48,
                height: 48,

                borderRadius: '50%',

                background:
                  'var(--gradient-gold)',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                color: 'white',

                fontWeight: 800,
                fontSize: '1rem',

                boxShadow:
                  '0 10px 25px rgba(196,122,43,0.35)',
              }}
            >
              {user?.username
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <div
                style={{
                  color: 'white',

                  fontWeight: 700,
                  fontSize: '0.92rem',
                }}
              >
                {user?.username}
              </div>

              <div
                style={{
                  color:
                    'rgba(196,122,43,0.78)',

                  fontSize: '0.7rem',

                  letterSpacing: '0.14em',

                  textTransform: 'uppercase',

                  marginTop: 2,
                }}
              >
                {user?.role}
              </div>

            </div>

          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}

            style={{
              width: '100%',
              height: 52,

              border: 'none',
              borderRadius: 16,

              cursor: 'pointer',

              background:
                'rgba(255,255,255,0.06)',

              color:
                'rgba(255,255,255,0.82)',

              fontWeight: 700,

              letterSpacing: '0.08em',
              textTransform: 'uppercase',

              backdropFilter:
                'blur(10px)',

              transition:
                'all .35s cubic-bezier(.16,1,.3,1)',
            }}

            onMouseEnter={e => {

              e.currentTarget.style.background =
                'rgba(196,122,43,0.18)'

              e.currentTarget.style.transform =
                'translateY(-2px)'

              e.currentTarget.style.color =
                'white'
            }}

            onMouseLeave={e => {

              e.currentTarget.style.background =
                'rgba(255,255,255,0.06)'

              e.currentTarget.style.transform =
                'translateY(0px)'

              e.currentTarget.style.color =
                'rgba(255,255,255,0.82)'
            }}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main
        style={{
          marginLeft: 326,

          flex: 1,

          padding:
            '2.5rem 2.5rem 2.5rem 1rem',

          minHeight: '100vh',
        }}
      >

        <div
          style={{
            minHeight: '100%',

            borderRadius: 32,

            background:
              'rgba(255,255,255,0.03)',

            border:
              '1px solid rgba(255,255,255,0.04)',

            backdropFilter:
              'blur(16px)',

            padding: '2rem',

            boxShadow:
              '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >

          <Outlet />

        </div>

      </main>

      <style>{`

        @keyframes floatLogo {

          0% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-6px);
          }

          100% {
            transform: translateY(0px);
          }

        }

      `}</style>

    </div>
  )
}