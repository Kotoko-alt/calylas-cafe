// Login.jsx

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function Login() {

  const navigate = useNavigate()

  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {

    e.preventDefault()

    setLoading(true)

    try {

      await login(username, password)

      navigate('/admin')

    } catch (err) {

      alert(
        err.response?.data?.message
        || 'Login failed'
      )

    } finally {

      setLoading(false)

    }

  }

  return (

    <div
      style={{
        minHeight: '100vh',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: '2rem',

        background:
          `
          radial-gradient(
            circle at top right,
            rgba(196,122,43,0.12),
            transparent 30%
          ),

          linear-gradient(
            135deg,
            #0f0906 0%,
            #1a120d 45%,
            #2b1a11 100%
          )
          `,
      }}
    >

      {/* CARD */}
      <div
        style={{
          width: '100%',
          maxWidth: 460,

          position: 'relative',

          overflow: 'hidden',

          borderRadius: 32,

          background:
            'rgba(255,255,255,0.04)',

          border:
            '1px solid rgba(255,255,255,0.06)',

          backdropFilter:
            'blur(18px)',

          boxShadow:
            '0 20px 60px rgba(0,0,0,0.4)',

          padding: '3rem',
        }}
      >

        {/* GLOW */}
        <div
          style={{
            position: 'absolute',

            top: -120,
            right: -120,

            width: 250,
            height: 250,

            borderRadius: '50%',

            background:
              'rgba(196,122,43,0.15)',

            filter: 'blur(90px)',
          }}
        />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate('/')}

          style={{
            border: 'none',

            background: 'transparent',

            color:
              'rgba(255,255,255,0.65)',

            display: 'flex',
            alignItems: 'center',

            gap: '0.5rem',

            cursor: 'pointer',

            marginBottom: '2rem',

            fontSize: '0.82rem',

            fontWeight: 700,

            letterSpacing: '0.08em',

            textTransform: 'uppercase',

            transition: 'all .3s ease',
          }}

          onMouseEnter={e => {

            e.target.style.color = '#fff'

            e.target.style.transform =
              'translateX(-3px)'
          }}

          onMouseLeave={e => {

            e.target.style.color =
              'rgba(255,255,255,0.65)'

            e.target.style.transform =
              'translateX(0px)'
          }}
        >
          ← Back to Website
        </button>

        {/* LOGO */}
        <img
          src="/logo.jpg"
          alt="logo"

          style={{
            width: 90,
            height: 90,

            borderRadius: '50%',

            objectFit: 'cover',

            margin:
              '0 auto 1.5rem',

            display: 'block',

            border:
              '3px solid rgba(196,122,43,0.4)',

            boxShadow:
              '0 15px 40px rgba(0,0,0,0.4)',
          }}
        />

        {/* TITLE */}
        <h1
          style={{
            fontFamily:
              'Playfair Display, serif',

            color: 'white',

            fontSize: '2.4rem',

            textAlign: 'center',

            marginBottom: '0.5rem',

            letterSpacing: '-0.04em',
          }}
        >
          Admin Login
        </h1>

        {/* SUBTITLE */}
        <p
          style={{
            textAlign: 'center',

            color:
              'rgba(255,255,255,0.55)',

            marginBottom: '2.5rem',

            lineHeight: 1.7,
          }}
        >
          Access the Calyla's Café
          management dashboard
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* USERNAME */}
          <div
            style={{
              marginBottom: '1.2rem',
            }}
          >

            <input
              type="text"

              placeholder="Username"

              value={username}

              onChange={e =>
                setUsername(e.target.value)
              }

              required

              style={inputStyle}
            />

          </div>

          {/* PASSWORD */}
          <div
            style={{
              marginBottom: '1.6rem',
            }}
          >

            <input
              type="password"

              placeholder="Password"

              value={password}

              onChange={e =>
                setPassword(e.target.value)
              }

              required

              style={inputStyle}
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"

            disabled={loading}

            style={{
              width: '100%',
              height: 58,

              border: 'none',
              borderRadius: 20,

              cursor: 'pointer',

              background:
                'linear-gradient(135deg,#C47A2B,#A86420)',

              color: 'white',

              fontWeight: 800,

              fontSize: '0.85rem',

              letterSpacing: '0.14em',

              textTransform: 'uppercase',

              boxShadow:
                '0 18px 45px rgba(196,122,43,0.35)',

              transition:
                'all .35s ease',
            }}

            onMouseEnter={e => {

              e.target.style.transform =
                'translateY(-3px) scale(1.02)'
            }}

            onMouseLeave={e => {

              e.target.style.transform =
                'translateY(0px) scale(1)'
            }}
          >

            {loading
              ? 'Signing In...'
              : 'Login'}

          </button>

        </form>

      </div>

    </div>

  )
}

const inputStyle = {

  width: '100%',

  height: 58,

  borderRadius: 18,

  border:
    '1px solid rgba(255,255,255,0.08)',

  background:
    'rgba(255,255,255,0.05)',

  backdropFilter:
    'blur(12px)',

  padding: '0 1.2rem',

  color: 'white',

  fontSize: '0.95rem',

  outline: 'none',
}