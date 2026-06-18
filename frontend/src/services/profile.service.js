import api from './api'

export const profileService = {
  async get() {
    const { data } = await api.get('/api/profile')
    return data.data
  },

  async update(fields) {
    const { data } = await api.patch('/api/profile', fields)
    return data.data
  },

  async updateLevel(cefr_level) {
    const { data } = await api.patch('/api/profile/level', { cefr_level })
    return data.data
  },

  async getTopReaders() {
    const { data } = await api.get('/api/profile/top-readers')
    return data.data
  },

  async updateGoal({ reading_goal, reading_goal_year }) {
    const { data } = await api.patch('/api/profile/goal', {
      reading_goal,
      reading_goal_year,
    })
    return data.data
  },
}
