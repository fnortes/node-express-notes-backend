const supertest = require('supertest')
const { app } = require('../index')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Test note 1',
    important: true,
    date: new Date()
  },
  {
    content: 'Test note 2',
    important: false,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    response,
    contents: response.body.map((note) => note.content)
  }
}

module.exports = { api, initialNotes, getAllContentFromNotes }
