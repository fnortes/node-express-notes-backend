const ERROR_HANDLERS = {
  CastError: (res) =>
    res.status(400).json({
      error: 'id used is malformed'
    }),

  JsonWebTokenError: (res) =>
    res.status(401).json({
      error: 'Token missing or invalid'
    }),

  TokenExpirerError: (res) =>
    res.status(401).json({
      error: 'Token expired'
    }),

  defaultError: (res) => res.status(500).end()
}

const errorHandler = (err, req, res, next) => {
  console.error(err.name)
  const handler = ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError

  handler(res)
}

module.exports = errorHandler
