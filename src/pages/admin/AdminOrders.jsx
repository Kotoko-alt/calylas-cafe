import { useEffect, useState } from 'react'
import axios from 'axios'

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Preparing: '#3B82F6',
  Completed: '#10B981',
  Cancelled: '#EF4444',
}

export default function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = () => {

    axios.get('http://localhost:5000/api/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (
    id,
    status
  ) => {

    try {

        await axios.put(
      `http://localhost:5000/api/orders/${id}`,
      { status }
    )

      fetchOrders()

    } catch {

      alert('Error updating order.')

    }
  }

  const pendingCount =
    orders.filter(
      o => o.status === 'Pending'
    ).length

  const completedCount =
    orders.filter(
      o => o.status === 'Completed'
    ).length

  const totalRevenue = orders
    .filter(
      o => o.status === 'Completed'
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    )

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
            Orders Dashboard
          </h1>

          <p
            style={{
              marginTop: 6,

              color:
                'rgba(255,255,255,0.55)',

              fontSize: '0.95rem',
            }}
          >
            Manage and monitor café orders
          </p>

        </div>

        <button
          onClick={fetchOrders}

          style={primaryButton}

          onMouseEnter={hoverPrimary}
          onMouseLeave={leavePrimary}
        >
          Refresh Orders
        </button>

      </div>

      {/* STATS */}
      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            'repeat(auto-fit,minmax(230px,1fr))',

          gap: '1.2rem',

          marginBottom: '2rem',
        }}
      >

        {[
          {
            label: 'Total Orders',
            value: orders.length,
            sub: 'All customer orders',
            glow: 'rgba(168,85,247,0.35)',
          },

          {
            label: 'Revenue',
            value: `₱${totalRevenue}`,
            sub: 'Completed orders only',
            glow: 'rgba(16,185,129,0.35)',
          },

          {
            label: 'Pending',
            value: pendingCount,
            sub: 'Need attention',
            glow: 'rgba(245,158,11,0.35)',
          },

          {
            label: 'Completed',
            value: completedCount,
            sub: 'Successfully served',
            glow: 'rgba(59,130,246,0.35)',
          },

        ].map(card => (

          <div
            key={card.label}

            style={{
              position: 'relative',

              overflow: 'hidden',

              padding: '1.6rem',

              borderRadius: 28,

              background:
                'rgba(255,255,255,0.04)',

              border:
                '1px solid rgba(255,255,255,0.06)',

              backdropFilter:
                'blur(18px)',

              boxShadow:
                '0 18px 50px rgba(0,0,0,0.22)',
            }}
          >

            {/* glow */}
            <div
              style={{
                position: 'absolute',

                top: -80,
                right: -80,

                width: 180,
                height: 180,

                borderRadius: '50%',

                background: card.glow,

                filter: 'blur(70px)',
              }}
            />

            <div
              style={{
                position: 'relative',
              }}
            >

              <div
                style={{
                  width: 58,
                  height: 58,

                  borderRadius: 18,

                  background:
                    'rgba(255,255,255,0.05)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  marginBottom: '1rem',

                  color: 'white',

                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                ●
              </div>

              <div
                style={{
                  color:
                    'rgba(255,255,255,0.55)',

                  fontSize: '0.76rem',

                  textTransform: 'uppercase',

                  letterSpacing: '0.16em',

                  fontWeight: 700,

                  marginBottom: '0.5rem',
                }}
              >
                {card.label}
              </div>

              <div
                style={{
                  fontFamily:
                    'Playfair Display, serif',

                  color: 'white',

                  fontSize: '2.2rem',

                  fontWeight: 800,

                  lineHeight: 1,
                }}
              >
                {card.value}
              </div>

              <div
                style={{
                  marginTop: '0.6rem',

                  color:
                    'rgba(255,255,255,0.45)',

                  fontSize: '0.85rem',
                }}
              >
                {card.sub}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* LOADING */}
      {loading ? (

        <GlassCard>

          <div
            style={{
              padding: '4rem',
              textAlign: 'center',

              color:
                'rgba(255,255,255,0.6)',
            }}
          >
            Loading orders...
          </div>

        </GlassCard>

      ) : orders.length === 0 ? (

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
                marginTop: '1rem',

                color:
                  'rgba(255,255,255,0.55)',
              }}
            >
              No orders yet.
            </p>

          </div>

        </GlassCard>

      ) : (

        <div
          style={{
            display: 'grid',
            gap: '1.5rem',
          }}
        >

          {orders.map(order => (

            <div
              key={order._id}

              style={{
                position: 'relative',

                overflow: 'hidden',

                padding: '1.8rem',

                borderRadius: 30,

                background:
                  'rgba(255,255,255,0.04)',

                border:
                  '1px solid rgba(255,255,255,0.06)',

                backdropFilter:
                  'blur(16px)',

                boxShadow:
                  '0 18px 50px rgba(0,0,0,0.22)',
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
                    `${STATUS_COLORS[order.status]}20`,

                  filter: 'blur(80px)',
                }}
              />

              {/* TOP */}
              <div
                style={{
                  position: 'relative',

                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems: 'flex-start',

                  gap: '1rem',

                  flexWrap: 'wrap',

                  marginBottom: '1.6rem',
                }}
              >

                <div>

                  <h2
                    style={{
                      fontFamily:
                        'Playfair Display, serif',

                      color: 'white',

                      fontSize: '1.5rem',

                      marginBottom: '0.3rem',
                    }}
                  >
                    {order.customerName ||
                      'Walk-in Customer'}
                  </h2>

                  <p
                    style={{
                      color:
                        'rgba(255,255,255,0.4)',

                      fontSize: '0.8rem',
                    }}
                  >
                    Order ID: {order._id}
                  </p>

                </div>

                <span
                  style={{
                    background:
                      `${STATUS_COLORS[order.status]}15`,

                    color:
                      STATUS_COLORS[order.status],

                    border:
                      `1px solid ${STATUS_COLORS[order.status]}25`,

                    padding:
                      '0.55rem 1rem',

                    borderRadius: 999,

                    fontSize: '0.75rem',

                    fontWeight: 800,

                    letterSpacing: '0.14em',

                    textTransform: 'uppercase',

                    backdropFilter:
                      'blur(10px)',
                  }}
                >
                  {order.status}
                </span>

              </div>

              {/* ITEMS */}
              <div
                style={{
                  position: 'relative',

                  marginBottom: '1.6rem',

                  borderTop:
                    '1px solid rgba(255,255,255,0.05)',

                  borderBottom:
                    '1px solid rgba(255,255,255,0.05)',

                  padding: '1rem 0',
                }}
              >

                {order.items?.map(
                  (item, i) => (

                    <div
                      key={i}

                      style={{
                        display: 'flex',

                        justifyContent:
                          'space-between',

                        alignItems: 'center',

                        padding:
                          '0.65rem 0',
                      }}
                    >

                      <div>

                        <span
                          style={{
                            color: '#E7B16D',

                            fontWeight: 800,
                          }}
                        >
                          {item.quantity || 1}×
                        </span>{' '}

                        <span
                          style={{
                            color:
                              'rgba(255,255,255,0.88)',
                          }}
                        >
                          {item.name}
                        </span>

                      </div>

                      <span
                        style={{
                          color: '#E7B16D',

                          fontWeight: 700,
                        }}
                      >
                        ₱
                        {Number(item.price || 0)
                        * Number(item.quantity || 1)}
                      </span>

                    </div>

                  )
                )}

              </div>

              {/* BOTTOM */}
              <div
                style={{
                  position: 'relative',

                  display: 'flex',

                  justifyContent:
                    'space-between',

                  alignItems: 'center',

                  gap: '1rem',

                  flexWrap: 'wrap',
                }}
              >

                <div>

                  <div
                    style={{
                      color:
                        'rgba(255,255,255,0.45)',

                      fontSize: '0.8rem',

                      marginBottom: '0.25rem',
                    }}
                  >
                    Total
                  </div>

                  <div
                    style={{
                      fontFamily:
                        'Playfair Display, serif',

                      fontSize: '1.8rem',

                      fontWeight: 800,

                      color: '#E7B16D',
                    }}
                  >
                    ₱{order.total}
                  </div>

                </div>

                <select
                  value={order.status}

                  onChange={e =>
                    updateStatus(
                      order._id,
                      e.target.value
                    )
                  }

                  style={{
                    padding:
                      '0.85rem 1.2rem',

                    borderRadius: 16,

                    border:
                      '1px solid rgba(255,255,255,0.08)',

                    background:
                      'rgba(255,255,255,0.05)',

                    color: 'white',

                    fontWeight: 700,

                    cursor: 'pointer',

                    outline: 'none',

                    backdropFilter:
                      'blur(10px)',
                  }}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Preparing">
                    Preparing
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>

          ))}

        </div>

      )}

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
          '0 18px 50px rgba(0,0,0,0.22)',
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