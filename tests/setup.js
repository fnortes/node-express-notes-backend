const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const User = require('../models/User')
const { initialNotes, initialUsers, api, getToken } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of initialUsers) {
    await api.post('/api/users').send(user)
  }

  await Note.deleteMany({})

  const token = await getToken()

  for (const note of initialNotes) {
    await api.post('/api/notes').send(note).set('Authorization', token)
  }
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
