require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')

const logger = require('./middlewares/logger')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')

app.use(cors())
app.use(express.json())

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Server is running</h1>')
})

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find({})

  res.json(notes)
})

app.get('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await Note.findById(id)
    if (result === null) {
      next()
    } else {
      res.json(result)
    }
  } catch (err) {
    next(err)
  }
})

app.put('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  try {
    const result = await Note.findByIdAndUpdate(id, newNoteInfo, { new: true })

    if (result === null) {
      next()
    } else {
      res.json(result)
    }
  } catch (err) {
    next(err)
  }
})

app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await Note.findByIdAndDelete(id)

    if (result === null) {
      next()
    } else {
      res.status(204).json(result)
    }
  } catch (err) {
    next(err)
  }
})

app.post('/api/notes', async (req, res, next) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'Content is missing '
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: note.important !== undefined ? note.important : false
  })

  try {
    const savedNote = await newNote.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)

app.use(notFound)

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
