import { useState, useEffect } from 'react'
import axios from 'axios'

const emptyForm = {
  username: '',
  password: '',
  role: 'admin',
}

export default function AdminUsers() {

  const [users, setUsers] = useState([])

  const [form, setForm] = useState(emptyForm)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showForm, setShowForm] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

  const fetchUsers = () => {

    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleChange = e => {

    setForm(f => ({
      ...f,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async e => {

    e.preventDefault()

    setSaving(true)

    try {

      await axios.post(
        '/api/users',
        form
      )

      setForm(emptyForm)

      setShowForm(false)

      setShowPassword(false)

      fetchUsers()

    } catch (err) {

      alert(
        err.response?.data?.message
        || 'Error creating user.'
      )

    } finally {

      setSaving(false)

    }
  }

  const handleDelete = async id => {

    if (!confirm('Delete this user?')) return

    try {

      await axios.delete(
        `/api/users/${id}`
      )

      fetchUsers()

    } catch (err) {

      alert(
        err.response?.data?.message
        || 'Error deleting user.'
      )

    }
  }

  const inputStyle = {

    width: '100%',

    height: 56,

    padding: '0 1.1rem',

    borderRadius: 18,

    border:
      '1px solid rgba(255,255,255,0.06)',

    background:
      'rgba(255,255,255,0.05)',

    color: 'white',

    outline: 'none',

    fontSize: '0.92rem',

    backdropFilter: 'blur(12px)',

    transition:
      'all .3s ease',
  }

  return (

    <div>

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',

          marginBottom: '2rem',

          flexWrap: 'wrap',

          gap: '1rem',
        }}
      >

        <div>

          <h1
            style={{
              fontFamily:
                'Playfair Display, serif',

              fontSize: '2.5rem',

              color: 'white',

              fontWeight: 800,

              letterSpacing: '-0.04em',
            }}
          >
            User Management
          </h1>

          <p
            style={{
              marginTop: 6,

              color:
                'rgba(255,255,255,0.55)',

              fontSize: '0.95rem',
            }}
          >
            {users.length} admin users
          </p>

        </div>

        {!showForm && (

          <button
            onClick={() =>
              setShowForm(true)
            }

            style={primaryButton}

            onMouseEnter={hoverPrimary}
            onMouseLeave={leavePrimary}
          >
            + Add User
          </button>

        )}

      </div>

      {/* FORM */}
      {showForm && (

        <div
          style={{
            position: 'relative',

            overflow: 'hidden',

            padding: '2rem',

            borderRadius: 30,

            background:
              'rgba(255,255,255,0.04)',

            border:
              '1px solid rgba(255,255,255,0.06)',

            backdropFilter:
              'blur(18px)',

            boxShadow:
              '0 20px 60px rgba(0,0,0,0.28)',

            marginBottom: '2rem',
          }}
        >

          {/* glow */}
          <div
            style={{
              position: 'absolute',

              top: -100,
              right: -100,

              width: 220,
              height: 220,

              borderRadius: '50%',

              background:
                'rgba(196,122,43,0.14)',

              filter: 'blur(80px)',
            }}
          />

          <h2
            style={{
              position: 'relative',

              fontFamily:
                'Playfair Display, serif',

              color: 'white',

              fontSize: '1.6rem',

              marginBottom: '1.8rem',
            }}
          >
            Create New User
          </h2>

          <form onSubmit={handleSubmit}>

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  'repeat(auto-fit,minmax(240px,1fr))',

                gap: '1rem',

                marginBottom: '1.6rem',
              }}
            >

              {/* USERNAME */}
              <Field label="Username">

                <input
                  type="text"

                  name="username"

                  value={form.username}

                  onChange={handleChange}

                  required

                  placeholder="Enter username"

                  style={inputStyle}

                  onFocus={focusInput}
                  onBlur={blurInput}
                />

              </Field>

              {/* PASSWORD */}
              <Field label="Password">

                <div
                  style={{
                    position: 'relative',
                  }}
                >

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }

                    name="password"

                    value={form.password}

                    onChange={handleChange}

                    required

                    placeholder="Enter password"

                    style={{
                      ...inputStyle,

                      paddingRight: '3.2rem',
                    }}

                    onFocus={focusInput}
                    onBlur={blurInput}
                  />

                  <button
                    type="button"

                    onClick={() =>
                      setShowPassword(v => !v)
                    }

                    style={{
                      position: 'absolute',

                      top: '50%',
                      right: '1rem',

                      transform:
                        'translateY(-50%)',

                      border: 'none',

                      background: 'none',

                      cursor: 'pointer',

                      color:
                        'rgba(255,255,255,0.55)',

                      fontSize: '1rem',
                    }}
                  >
                    {showPassword
                      ? '🙈'
                      : '👁️'}
                  </button>

                </div>

              </Field>

              {/* ROLE */}
              <Field label="Role">

                <select
                  name="role"

                  value={form.role}

                  onChange={handleChange}

                  style={{
                    ...inputStyle,

                    cursor: 'pointer',
                  }}
                >

                  <option value="admin">
                    Admin
                  </option>

                  <option value="staff">
                    Staff
                  </option>

                </select>

              </Field>

            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',

                flexWrap: 'wrap',
              }}
            >

              <button
                type="submit"

                disabled={saving}

                style={{
                  ...primaryButton,

                  opacity: saving ? .7 : 1,

                  cursor:
                    saving
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >

                {saving
                  ? 'Saving...'
                  : 'Add User'}

              </button>

              <button
                type="button"

                onClick={() => {

                  setShowForm(false)

                  setForm(emptyForm)

                  setShowPassword(false)

                }}

                style={{
                  height: 54,

                  padding:
                    '0 1.5rem',

                  borderRadius: 18,

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  background:
                    'rgba(255,255,255,0.04)',

                  color:
                    'rgba(255,255,255,0.75)',

                  cursor: 'pointer',

                  fontWeight: 700,

                  transition:
                    'all .3s ease',
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* TABLE */}
      {loading ? (

        <GlassCard>

          <div
            style={{
              textAlign: 'center',

              padding: '4rem',

              color:
                'rgba(255,255,255,0.55)',
            }}
          >
            Loading users...
          </div>

        </GlassCard>

      ) : users.length === 0 ? (

        <GlassCard>

          <div
            style={{
              textAlign: 'center',

              padding: '4rem',
            }}
          >

            <div
              style={{
                fontSize: '4rem',
              }}
            >
              👤
            </div>

            <p
              style={{
                marginTop: '1rem',

                color:
                  'rgba(255,255,255,0.55)',
              }}
            >
              No users found.
            </p>

          </div>

        </GlassCard>

      ) : (

        <div
          style={{
            overflow: 'hidden',

            borderRadius: 30,

            background:
              'rgba(255,255,255,0.04)',

            border:
              '1px solid rgba(255,255,255,0.06)',

            backdropFilter:
              'blur(18px)',

            boxShadow:
              '0 20px 60px rgba(0,0,0,0.28)',
          }}
        >

          <table
            style={{
              width: '100%',

              borderCollapse:
                'collapse',
            }}
          >

            <thead>

              <tr
                style={{
                  background:
                    'rgba(255,255,255,0.04)',
                }}
              >

                {[
                  '#',
                  'User',
                  'Role',
                  'Actions',
                ].map(h => (

                  <th
                    key={h}

                    style={{
                      padding:
                        '1.2rem 1.4rem',

                      textAlign: 'left',

                      color:
                        'rgba(255,255,255,0.55)',

                      fontSize: '0.75rem',

                      letterSpacing: '0.16em',

                      textTransform:
                        'uppercase',
                    }}
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {users.map((u, i) => (

                <tr
                  key={u._id}

                  style={{
                    borderTop:
                      '1px solid rgba(255,255,255,0.05)',
                  }}
                >

                  {/* NUMBER */}
                  <td
                    style={{
                      padding:
                        '1.2rem 1.4rem',

                      color:
                        'rgba(255,255,255,0.45)',
                    }}
                  >
                    {i + 1}
                  </td>

                  {/* USER */}
                  <td
                    style={{
                      padding:
                        '1.2rem 1.4rem',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',

                        gap: '0.9rem',
                      }}
                    >

                      <div
                        style={{
                          width: 44,
                          height: 44,

                          borderRadius: '50%',

                          background:
                            'var(--gradient-gold)',

                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                          color: 'white',

                          fontWeight: 800,

                          boxShadow:
                            '0 10px 30px rgba(196,122,43,0.35)',
                        }}
                      >
                        {u.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <div
                          style={{
                            color: 'white',

                            fontWeight: 700,
                          }}
                        >
                          {u.username}
                        </div>

                        <div
                          style={{
                            color:
                              'rgba(255,255,255,0.42)',

                            fontSize: '0.78rem',
                          }}
                        >
                          User Account
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* ROLE */}
                  <td
                    style={{
                      padding:
                        '1.2rem 1.4rem',
                    }}
                  >

                    <span
                      style={{
                        padding:
                          '0.5rem 0.95rem',

                        borderRadius: 999,

                        background:
                          u.role === 'admin'
                            ? 'rgba(196,122,43,0.15)'
                            : 'rgba(255,255,255,0.08)',

                        color:
                          u.role === 'admin'
                            ? '#E7B16D'
                            : 'rgba(255,255,255,0.72)',

                        fontSize: '0.75rem',

                        fontWeight: 700,

                        letterSpacing: '0.12em',

                        textTransform: 'uppercase',
                      }}
                    >
                      {u.role}
                    </span>

                  </td>

                  {/* ACTION */}
                  <td
                    style={{
                      padding:
                        '1.2rem 1.4rem',
                    }}
                  >

                    <button
                      onClick={() =>
                        handleDelete(u._id)
                      }

                      style={{
                        border: 'none',

                        borderRadius: 14,

                        padding:
                          '0.65rem 1rem',

                        cursor: 'pointer',

                        background:
                          'rgba(239,68,68,0.15)',

                        color: '#FCA5A5',

                        fontWeight: 700,

                        transition:
                          'all .3s ease',
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  )
}

function Field({
  label,
  children,
}) {

  return (

    <div>

      <label
        style={{
          display: 'block',

          marginBottom: '0.55rem',

          color:
            'rgba(255,255,255,0.72)',

          fontSize: '0.75rem',

          fontWeight: 700,

          letterSpacing: '0.16em',

          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>

      {children}

    </div>

  )
}

function GlassCard({ children }) {

  return (

    <div
      style={{
        borderRadius: 30,

        background:
          'rgba(255,255,255,0.04)',

        border:
          '1px solid rgba(255,255,255,0.06)',

        backdropFilter:
          'blur(18px)',

        boxShadow:
          '0 20px 60px rgba(0,0,0,0.28)',
      }}
    >
      {children}
    </div>

  )
}

const primaryButton = {

  height: 54,

  padding: '0 1.6rem',

  border: 'none',
  borderRadius: 18,

  cursor: 'pointer',

  background:
    'var(--gradient-gold)',

  color: 'white',

  fontWeight: 800,

  letterSpacing: '0.08em',

  boxShadow:
    '0 16px 40px rgba(196,122,43,0.35)',

  transition:
    'all .35s cubic-bezier(.16,1,.3,1)',
}

const hoverPrimary = e => {

  e.currentTarget.style.transform =
    'translateY(-3px) scale(1.02)'
}

const leavePrimary = e => {

  e.currentTarget.style.transform =
    'translateY(0px) scale(1)'
}

const focusInput = e => {

  e.target.style.borderColor =
    'rgba(196,122,43,0.35)'

  e.target.style.boxShadow =
    '0 0 0 4px rgba(196,122,43,0.08)'
}

const blurInput = e => {

  e.target.style.borderColor =
    'rgba(255,255,255,0.06)'

  e.target.style.boxShadow =
    'none'
}