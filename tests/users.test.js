const { initialUsers, api, getAllUsernameFromUsers } = require('./helpers')

describe('GET /api/users', () => {
  test('Users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are two users', async () => {
    const { users } = await getAllUsernameFromUsers()

    expect(users).toHaveLength(initialUsers.length)
  })

  test('The first username is ok', async () => {
    const { usernames } = await getAllUsernameFromUsers()

    expect(usernames).toContain(initialUsers[0].username)
  })
})

describe('POST /api/users', () => {
  test('A valid user can be added', async () => {
    const newUser = {
      username: 'newUser',
      name: 'New user',
      password: 'test'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const { usernames, users } = await getAllUsernameFromUsers()

    expect(users).toHaveLength(initialUsers.length + 1)
    expect(usernames).toContain(newUser.username)
  })

  test('User without username or ite is already taken, is not added', async () => {
    const newUser = {
      username: 'user1',
      name: 'New user',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const { users } = await getAllUsernameFromUsers()

    expect(users).toHaveLength(initialUsers.length)
    expect(result.body.errors.username.message).toContain(
      '`username` to be unique'
    )
  })
})
