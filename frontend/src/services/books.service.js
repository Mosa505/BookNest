import api from './api'

export const booksService = {
  async getAll(params = {}) {
    const { data } = await api.get('/api/books', { params })
    return data
  },

  async getById(id) {
    const { data } = await api.get(`/api/books/${id}`)
    return data.data
  },

  async getCategories() {
    const { data } = await api.get('/api/books/categories')
    return data.data
  },

  async getTrending(limit = 10) {
    const { data } = await api.get('/api/books/trending', { params: { limit } })
    return data.data
  },

  async uploadCover(id, file, onProgress) {
    const formData = new FormData()
    formData.append('cover', file)
    const { data } = await api.post(`/api/books/${id}/upload-cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
    return data.data
  },

  async uploadContent(id, file, onProgress) {
    const formData = new FormData()
    formData.append('content', file)
    const { data } = await api.post(`/api/books/${id}/upload-content`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
    })
    return data.data
  },

  async deleteFile(id, type) {
    const { data } = await api.delete(`/api/books/${id}/delete-file/${type}`)
    return data
  },

  async getKidsBooks(ageGroup = null) {
    const params = { category: 'Kids', limit: 20 }
    if (ageGroup) {
      params.age_group = ageGroup
    }
    const { data } = await api.get('/api/books', { params })
    return data
  },
}
