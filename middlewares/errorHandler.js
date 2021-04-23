const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.name === 'CastError') {
    res.status(400).json({
      error: 'id used is malformed'
    })
  } else {
    res.status(500).end()
  }
}

module.exports = errorHandler
