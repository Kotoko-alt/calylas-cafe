import { useState, useEffect } from 'react'
import axios from 'axios'

const CATEGORIES = [
  'Hot Coffee',
  'Iced Coffee',
  'Frappucino',
  'Hot Latte',
  'Iced Latte',
  'Fruit Soda',
  'Non Coffee',
  'Cookies',
  'Other Pastries',
  'French Fries',
  'Cake Slice',
  'Whole Cake',
  'Add-Ons',
  'Delivery Fee'
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  photo: null,
}

const buildPhotoSrc = item => {
  const photoFromName = item && item.name
    ? `http://localhost:5000/api/uploads/${encodeURIComponent(item.name.trim())}.png`
    : null

  if (!item || !item.photo) return photoFromName
  if (typeof item.photo === 'string') {
    return `http://localhost:5000/api/uploads/${item.photo}`
  }
  if (item.photoUrl) {
    return item.photoUrl.startsWith('http')
      ? item.photoUrl
      : `http://localhost:5000${item.photoUrl}`
  }
  if (item.photo.filename) {
    return `http://localhost:5000/api/uploads/${item.photo.filename}`
  }
  return photoFromName
}

export default function AdminMenu() {

  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [showForm, setShowForm] = useState(false)

  const [preview, setPreview] = useState(null)

  const fetchItems = () => {

    axios.get('http://localhost:5000/api/menu')
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleChange = e => {

    const { name, value, files } = e.target

    if (name === 'photo') {

      setForm(f => ({
        ...f,
        photo: files[0],
      }))

      setPreview(
        URL.createObjectURL(files[0])
      )

    } else {

      setForm(f => ({
        ...f,
        [name]: value,
      }))

    }
  }

  const handleSubmit = async e => {

    e.preventDefault()

    setSaving(true)

    try {

      const data = new FormData()

      Object.entries(form).forEach(([k, v]) => {

        if (v) data.append(k, v)

      })

      if (editId) {

        await axios.put(
        `http://localhost:5000/api/menu/${editId}`,
        data
      )

      } else {

            await axios.post(
        'http://localhost:5000/api/menu',
        data
      )

      }

      setForm(emptyForm)

      setEditId(null)

      setShowForm(false)

      setPreview(null)

      fetchItems()

    } catch (err) {

      alert('Error saving item.')

    } finally {

      setSaving(false)

    }
  }

  const handleEdit = item => {

    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || '',
      photo: null,
    })

    setEditId(item._id)

    setPreview(buildPhotoSrc(item))

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async id => {

    if (!confirm('Delete this item?')) return

    await axios.delete(`http://localhost:5000/api/menu/${id}`)

    fetchItems()
  }

  const handleCancel = () => {

    setForm(emptyForm)

    setEditId(null)

    setPreview(null)

    setShowForm(false)
  }

  const inputStyle = {

    width: '100%',

    padding: '1rem 1.1rem',

    borderRadius: 18,

    border:
      '1px solid rgba(255,255,255,0.06)',

    background:
      'rgba(255,255,255,0.05)',

    color: 'white',

    outline: 'none',

    fontSize: '0.92rem',

    backdropFilter: 'blur(12px)',

    transition: 'all .3s ease',
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
        }}
      >

        <div>

          <h1
            style={{
              fontFamily:
                'Playfair Display, serif',

              fontSize: '2.4rem',

              color: 'white',

              fontWeight: 800,

              letterSpacing: '-0.04em',
            }}
          >
            Menu Management
          </h1>

          <p
            style={{
              marginTop: 6,

              color:
                'rgba(255,255,255,0.55)',

              fontSize: '0.95rem',
            }}
          >
            {items.length} menu items available
          </p>

        </div>

        {!showForm && (

          <button
            onClick={() =>
              setShowForm(true)
            }

            style={primaryButton}
          >
            + Add Item
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

            borderRadius: 32,

            background:
              'rgba(255,255,255,0.04)',

            border:
              '1px solid rgba(255,255,255,0.06)',

            backdropFilter:
              'blur(18px)',

            marginBottom: '2rem',

            boxShadow:
              '0 20px 60px rgba(0,0,0,0.28)',
          }}
        >

          {/* glow */}
          <div
            style={{
              position: 'absolute',

              top: -100,
              right: -100,

              width: 240,
              height: 240,

              borderRadius: '50%',

              background:
                'rgba(196,122,43,0.14)',

              filter: 'blur(70px)',
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
            {editId
              ? 'Edit Menu Item'
              : 'Create New Item'}
          </h2>

          <form onSubmit={handleSubmit}>

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  'repeat(auto-fit,minmax(220px,1fr))',

                gap: '1rem',

                marginBottom: '1rem',
              }}
            >

              <Field
                label="Name"
              >
                <input
                  type="text"
                  name="name"

                  value={form.name}

                  onChange={handleChange}

                  placeholder="Cappuccino"

                  required

                  style={inputStyle}

                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </Field>

              <Field
                label="Price"
              >
                <input
                  type="number"
                  name="price"

                  value={form.price}

                  onChange={handleChange}

                  placeholder="0"

                  required

                  style={inputStyle}

                  onFocus={focusInput}
                  onBlur={blurInput}
                />
              </Field>

              <Field
                label="Category"
              >
                <select
                  name="category"

                  value={form.category}

                  onChange={handleChange}

                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                  }}
                >

                  <option value="">
                    Select Category
                  </option>

                  {CATEGORIES.map(c => (

                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>

                  ))}

                </select>
              </Field>

            </div>

            <Field label="Description">

              <textarea
                rows={4}

                name="description"

                value={form.description}

                onChange={handleChange}

                placeholder="Short item description..."

                style={{
                  ...inputStyle,
                  resize: 'vertical',
                }}

                onFocus={focusInput}
                onBlur={blurInput}
              />

            </Field>

            <Field label="Photo">

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',

                  flexWrap: 'wrap',
                }}
              >

                <label
                  style={{
                    padding:
                      '0.9rem 1.4rem',

                    borderRadius: 16,

                    background:
                      'rgba(255,255,255,0.05)',

                    border:
                      '1px solid rgba(255,255,255,0.06)',

                    color:
                      'rgba(255,255,255,0.8)',

                    cursor: 'pointer',

                    fontWeight: 600,

                    transition:
                      'all .3s ease',
                  }}
                >

                  Upload Image

                  <input
                    type="file"

                    name="photo"

                    accept="image/*"

                    onChange={handleChange}

                    hidden
                  />

                </label>

                {preview && (

                  <img
                    src={preview}
                    alt="preview"

                    style={{
                      width: 90,
                      height: 90,

                      borderRadius: 20,

                      objectFit: 'cover',

                      border:
                        '2px solid rgba(255,255,255,0.08)',

                      boxShadow:
                        '0 10px 30px rgba(0,0,0,0.25)',
                    }}
                  />

                )}

              </div>

            </Field>

            {/* BUTTONS */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',

                marginTop: '2rem',
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
                  : editId
                    ? 'Update Item'
                    : 'Add Item'}

              </button>

              <button
                type="button"

                onClick={handleCancel}

                style={{
                  height: 52,

                  padding:
                    '0 1.5rem',

                  borderRadius: 16,

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  background:
                    'rgba(255,255,255,0.04)',

                  color:
                    'rgba(255,255,255,0.72)',

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
                'rgba(255,255,255,0.6)',
            }}
          >
            Loading...
          </div>
        </GlassCard>

      ) : items.length === 0 ? (

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
              ☕
            </div>

            <p
              style={{
                color:
                  'rgba(255,255,255,0.55)',

                marginTop: '1rem',
              }}
            >
              No menu items yet
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
              'blur(16px)',

            boxShadow:
              '0 20px 60px rgba(0,0,0,0.28)',
          }}
        >

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
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
                  'Photo',
                  'Name',
                  'Category',
                  'Price',
                  'Actions',
                ].map(h => (

                  <th
                    key={h}

                    style={{
                      padding:
                        '1.2rem 1.4rem',

                      textAlign: 'left',

                      color:
                        'rgba(255,255,255,0.65)',

                      fontSize: '0.75rem',

                      letterSpacing: '0.16em',

                      textTransform: 'uppercase',
                    }}
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {items.map(item => (

                <tr
                  key={item._id}

                  style={{
                    borderTop:
                      '1px solid rgba(255,255,255,0.04)',
                  }}
                >

                  {/* PHOTO */}
                  <td
                    style={{
                      padding:
                        '1rem 1.4rem',
                    }}
                  >

                    {item.photo ? (

                      <img
                        src={buildPhotoSrc(item)}
                        alt={item.name}

                        style={{
                          width: 64,
                          height: 64,

                          borderRadius: 18,

                          objectFit: 'cover',
                        }}
                      />

                    ) : (

                      <div
                        style={{
                          width: 64,
                          height: 64,

                          borderRadius: 18,

                          background:
                            'rgba(255,255,255,0.05)',

                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                          fontSize: '1.5rem',
                        }}
                      >
                        ☕
                      </div>

                    )}

                  </td>

                  {/* NAME */}
                  <td
                    style={{
                      padding:
                        '1rem 1.4rem',
                    }}
                  >

                    <div
                      style={{
                        color: 'white',

                        fontWeight: 700,

                        fontSize: '0.96rem',
                      }}
                    >
                      {item.name}
                    </div>

                    {item.description && (

                      <div
                        style={{
                          marginTop: 6,

                          color:
                            'rgba(255,255,255,0.45)',

                          fontSize: '0.82rem',
                        }}
                      >
                        {item.description.substring(0, 50)}
                      </div>

                    )}

                  </td>

                  {/* CATEGORY */}
                  <td
                    style={{
                      padding:
                        '1rem 1.4rem',
                    }}
                  >

                    <span
                      style={{
                        padding:
                          '0.45rem 0.9rem',

                        borderRadius: 999,

                        background:
                          'rgba(196,122,43,0.14)',

                        color: '#E7B16D',

                        fontSize: '0.78rem',

                        fontWeight: 700,
                      }}
                    >
                      {item.category}
                    </span>

                  </td>

                  {/* PRICE */}
                  <td
                    style={{
                      padding:
                        '1rem 1.4rem',

                      color: '#E7B16D',

                      fontWeight: 700,

                      fontSize: '1rem',
                    }}
                  >
                    ₱{item.price}
                  </td>

                  {/* ACTIONS */}
                  <td
                    style={{
                      padding:
                        '1rem 1.4rem',
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        gap: '0.8rem',
                      }}
                    >

                      <button
                        onClick={() =>
                          handleEdit(item)
                        }

                        style={actionButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }

                        style={{
                          ...actionButton,

                          background:
                            'rgba(220,38,38,0.15)',

                          color: '#FCA5A5',
                        }}
                      >
                        Delete
                      </button>

                    </div>

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

    <div
      style={{
        marginBottom: '1rem',
      }}
    >

      <label
        style={{
          display: 'block',

          marginBottom: '0.55rem',

          color:
            'rgba(255,255,255,0.72)',

          fontSize: '0.74rem',

          fontWeight: 700,

          textTransform: 'uppercase',

          letterSpacing: '0.16em',
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

  height: 52,

  padding: '0 1.7rem',

  border: 'none',
  borderRadius: 16,

  cursor: 'pointer',

  background:
    'var(--gradient-gold)',

  color: 'white',

  fontWeight: 800,

  letterSpacing: '0.08em',

  boxShadow:
    '0 14px 35px rgba(196,122,43,0.35)',

  transition:
    'all .35s cubic-bezier(.16,1,.3,1)',
}

const actionButton = {

  border: 'none',

  borderRadius: 12,

  padding:
    '0.55rem 1rem',

  cursor: 'pointer',

  background:
    'rgba(196,122,43,0.15)',

  color: '#E7B16D',

  fontWeight: 700,

  transition:
    'all .3s ease',
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