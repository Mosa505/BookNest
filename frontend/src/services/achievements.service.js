import api from './api'

export const achievementsService = {
  async getUserAchievements() {
    const { data } = await api.get('/api/achievements/user')
    return data.data || []
  },

  async getAvailableAchievements() {
    const { data } = await api.get('/api/achievements')
    return data.data || []
  },

  async getKidsAchievements() {
    const { data } = await api.get('/api/achievements', { params: { category: 'Kids' } })
    return data.data || []
  },
}
