const jwt = require('jsonwebtoken')

const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = ''
  let decodedToken = {}

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
    try {
      decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (err) {
      return next(err)
    }
  }

  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'Token missing or invalid'
    })
  }

  const { id: userId } = decodedToken

  req.userId = userId

  next()
}

module.exports = userExtractor
