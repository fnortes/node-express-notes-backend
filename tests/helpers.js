const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Test note 1',
    important: true
  },
  {
    content: 'Test note 2',
    important: false
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')

  return {
    response,
    contents: response.body.map((note) => note.content)
  }
}

const initialUsers = [
  {
    username: 'user1',
    name: 'Name user 1',
    password: 'password1'
  },
  {
    username: 'user2',
    name: 'Name user 2',
    password: 'password2'
  }
]

const getAllUsernameFromUsers = async () => {
  const usersDb = await User.find({})
  const users = usersDb.map((user) => user.toJSON())
  const usernames = users.map((user) => user.username)

  return {
    users,
    usernames
  }
}

const getToken = async () => {
  const {
    body: { token }
  } = await api.post('/api/login').send({
    username: initialUsers[0].username,
    password: initialUsers[0].password
  })

  return `Bearer ${token}`
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  initialUsers,
  getAllUsernameFromUsers,
  getToken
}
