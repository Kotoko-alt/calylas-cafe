// API configuration
// Uses environment variable VITE_API_URL for dynamic backend URL switching

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default API_URL
