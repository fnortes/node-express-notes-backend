const { api, initialUsers } = require('./helpers')

describe('POST /api/login', () => {
  test('User that exist can be logged', async () => {
    const { body } = await api
      .post('/api/login')
      .send({
        username: initialUsers[0].username,
        password: initialUsers[0].password
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(body.username).toBe(initialUsers[0].username)
    expect(body.name).toBe(initialUsers[0].name)
    expect(body.token).not.toBeNull()
  })

  test('Fails if the username is not informed', async () => {
    const { body } = await api
      .post('/api/login')
      .send({
        password: initialUsers[0].password
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Invalid user or password')
  })

  test('Fails if password is not informed', async () => {
    const { body } = await api
      .post('/api/login')
      .send({
        username: initialUsers[0].username
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Invalid user or password')
  })

  test('Fails if password is not valid', async () => {
    const { body } = await api
      .post('/api/login')
      .send({
        username: initialUsers[0].username,
        password: 'test'
      })
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(body.error).toBe('Invalid user or password')
  })
})
