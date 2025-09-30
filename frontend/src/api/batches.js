import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Configure axios defaults
axios.defaults.baseURL = API_URL

const getBatches = async () => {
  console.debug('[api/batches] GET /api/batches request')
  const response = await axios.get(`/api/batches`)
  console.debug('[api/batches] GET /api/batches response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const getBatchStudents = async (id) => {
  console.debug('[api/batches] GET /api/batches/:id/students request', id)
  const response = await axios.get(`/api/batches/${id}/students`)
  console.debug('[api/batches] GET /api/batches/:id/students response', Array.isArray(response.data) ? response.data.length : response.data)
  return response.data
}

const batchService = { getBatches, getBatchStudents }

export default batchService

