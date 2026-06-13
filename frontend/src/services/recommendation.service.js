import api from './api'

export const recommendationService = {
  async getForUser(limit = 10) {
    const { data } = await api.get('/api/recommendations', {
      params: { limit },
    })
    return data.data
  },

  async getSimilarBooks(bookId, limit = 6) {
    const { data } = await api.get(
      `/api/recommendations/similar/${bookId}`,
      { params: { limit } },
    )
    return data.data
  },
}
