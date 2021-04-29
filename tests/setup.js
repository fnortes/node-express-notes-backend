const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const User = require('../models/User')
const { initialNotes, initialUsers } = require('./helpers')

beforeEach(async () => {
  await User.deleteMany({})
  const savedUsers = []

  for (const user of initialUsers) {
    const userObject = new User(user)
    savedUsers.push(await userObject.save())
  }

  await Note.deleteMany({})

  for (const note of initialNotes) {
    note.user = savedUsers[0]._id
    const noteObject = new Note(note)
    const savedNote = await noteObject.save()

    savedUsers[0].notes.push(savedNote._id)
    await savedUsers[0].save()
  }
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
