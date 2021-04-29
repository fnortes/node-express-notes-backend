const {
  api,
  initialNotes,
  getAllContentFromNotes,
  getAllUsernameFromUsers,
  getToken
} = require('./helpers')

describe('GET /test', () => {
  test('It is an incorrect route', async () => {
    await api.get('/test').expect(404)
  })
})

describe('GET /', () => {
  test('Return server is running message', async () => {
    const response = await api
      .get('/')
      .expect(200)
      .expect('Content-Type', /text\/html/)

    expect(response.text).toContain('Server is running')
  })
})

describe('GET /api/notes', () => {
  test('Notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two notes', async () => {
    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('The first note content is ok', async () => {
    const { contents } = await getAllContentFromNotes()

    expect(contents).toContain(initialNotes[0].content)
  })
})

describe('GET /api/notes/:id', () => {
  test('A note can be obtained', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const note = notes[0]

    const { body } = await api
      .get(`/api/notes/${note.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(body).toStrictEqual(note)
  })

  test('A note that not exist, with malformed id, can not be obtained', async () => {
    const { body } = await api
      .get('/api/notes/1234')
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('id used is malformed')
  })

  test('A note that not exist, with well formed id, can not be obtained', async () => {
    const { body } = await api
      .get('/api/notes/6082ae8e83b8fd155a78e395')
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Not found')
  })
})

describe('PUT /api/notes', () => {
  let token = ''

  beforeEach(async () => {
    token = await getToken()
  })

  test('A note can be updated', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const note = notes[0]

    const noteToUpdate = {
      content: 'New updated note',
      important: false
    }

    const { body } = await api
      .put(`/api/notes/${note.id}`)
      .set('Authorization', token)
      .send(noteToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(body.content).toBe(noteToUpdate.content)
    expect(body.important).toBe(noteToUpdate.important)

    const {
      contents,
      response: secondResponse
    } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length)
    expect(contents).toContain(noteToUpdate.content)
  })

  test('Only the content and important value can be updated', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const note = notes[0]

    const noteToUpdate = {
      content: 'New updated note',
      important: false,
      date: new Date()
    }

    const { body } = await api
      .put(`/api/notes/${note.id}`)
      .set('Authorization', token)
      .send(noteToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(body.content).toBe(noteToUpdate.content)
    expect(body.important).toBe(noteToUpdate.important)
    expect(body.date).not.toBe(noteToUpdate.date)

    const {
      contents,
      response: secondResponse
    } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length)
    expect(contents).toContain(noteToUpdate.content)
  })

  test('A note that not exist, with malformed id, can not be updated', async () => {
    const noteToUpdate = {
      content: 'New updated note',
      important: false
    }

    const { body } = await api
      .put('/api/notes/1234')
      .set('Authorization', token)
      .send(noteToUpdate)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('id used is malformed')
  })

  test('A note that not exist, with well formed id, can not be updated', async () => {
    const noteToUpdate = {
      content: 'New updated note',
      important: false
    }

    const { body } = await api
      .put('/api/notes/6082ae8e83b8fd155a78e395')
      .set('Authorization', token)
      .send(noteToUpdate)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Not found')
  })
})

describe('DELETE /api/notes/:id', () => {
  let token = ''

  beforeEach(async () => {
    token = await getToken()
  })

  test('A note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]

    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .set('Authorization', token)
      .expect(204)

    const {
      contents,
      response: secondResponse
    } = await getAllContentFromNotes()

    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)
    expect(contents).not.toContain(noteToDelete.content)
  })

  test('A note that not exist, with malformed id, can not be deleted', async () => {
    await api.delete('/api/notes/1234').set('Authorization', token).expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('A note that not exist, with well formed id, can not be deleted', async () => {
    const { body } = await api
      .delete('/api/notes/6082ae8e83b8fd155a78e395')
      .set('Authorization', token)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Not found')

    const { response } = await getAllContentFromNotes()
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('POST /api/notes', () => {
  let token = ''

  beforeEach(async () => {
    token = await getToken()
  })

  test('A valid note can be added', async () => {
    const { users } = await getAllUsernameFromUsers()

    const newNote = {
      content: 'New created note',
      important: true,
      userId: users[1].id
    }

    await api
      .post('/api/notes')
      .set('Authorization', token)
      .send(newNote)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain(newNote.content)
  })

  test('Note without content is not added', async () => {
    const newNote = {
      important: true,
      date: new Date()
    }

    await api
      .post('/api/notes')
      .set('Authorization', token)
      .send(newNote)
      .expect(400)

    const { response } = await getAllContentFromNotes()

    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('Note without a valid token is not added', async () => {
    const newNote = {
      content: 'New created note',
      important: true
    }

    const { body } = await api
      .post('/api/notes')
      .set('Authorization', 'Bearer testToken')
      .send(newNote)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(body.error).toBe('Token missing or invalid')
    expect(response.body).toHaveLength(initialNotes.length)
    expect(contents).not.toContain(newNote.content)
  })

  test('Note without token is not added', async () => {
    const newNote = {
      content: 'New created note',
      important: true
    }

    const { body } = await api
      .post('/api/notes')
      .send(newNote)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const { contents, response } = await getAllContentFromNotes()

    expect(body.error).toBe('Token missing or invalid')
    expect(response.body).toHaveLength(initialNotes.length)
    expect(contents).not.toContain(newNote.content)
  })
})
