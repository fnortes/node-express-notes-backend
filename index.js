require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')

// const logger = require('./middlewares/logger')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

app.use(cors())
app.use(express.json())

// app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

app.use(notFound)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
