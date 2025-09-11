import axios from 'axios'

const getBatches = async () => {
  const response = await axios.get(`/api/batches`)
  return response.data
}

const getBatchStudents = async (id) => {
  const response = await axios.get(`/api/batches/${id}/students`)
  return response.data
}

const batchService = { getBatches, getBatchStudents }

export default batchService

