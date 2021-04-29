const notesRouter = require('express').Router()
const userExtractor = require('../middlewares/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })

  res.json(notes)
})

notesRouter.get('/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const result = await Note.findById(id).populate('user', {
      username: 1,
      name: 1
    })

    if (result === null) {
      next()
    } else {
      res.json(result)
    }
  } catch (err) {
    next(err)
  }
})

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
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

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
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

notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body
  const { userId } = req
  const user = await User.findById(userId)

  if (!content) {
    return res.status(400).json({
      error: 'Content is missing '
    })
  }

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  const newNote = new Note({
    content: content,
    date: new Date().toISOString(),
    important,
    user: user._id
  })

  try {
    const savedNote = await newNote.save()

    user.notes.push(savedNote._id)
    await user.save()

    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
