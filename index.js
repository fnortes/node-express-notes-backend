const express = require('express')
const cors = require('cors')

const app = express()

const logger = require('./middlewares/logger')
const notFound = require('./middlewares/404')

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Nota 1 de prueba',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Nota 2 de prueba',
    date: '2019-05-30T20:47:31.098Z',
    important: false
  },
  {
    id: 3,
    content: 'Nota 3 de prueba de Fran',
    date: '2019-05-30T19:20:31.098Z',
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hola Mundo</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)

  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'Content is missing '
    })
  }

  const ids = notes.map((note) => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: note.important !== undefined ? note.important : false,
    date: new Date().toISOString()
  }

  notes.push(newNote)

  res.status(201).json(newNote)
})

app.use(notFound)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
