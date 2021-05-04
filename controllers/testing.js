const testingRouter = require('express').Router()
// const userExtractor = require('../middlewares/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

testingRouter.post('/reset', async (req, res) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  res.status(204).end()
})

module.exports = testingRouter
