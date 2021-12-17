// load .env variables
require('dotenv').config({ path: '.env' })
require('./app/core/utils')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080
const root = require('./app/routes/root')
const path = require('path')
const pkg = require('get-current-line').default // get current script filename and line
const log4js = require('./app/config/log4js')
var log = log4js.getLogger('app') // enable logging
// import utils

const whiteList = [`${process.env.APP_URL}:${port}`, `http://127.0.0.1:${port}`, 'http://www.yoursite.com']
var corsOptions = {
  origin: (_origin, callback) => { // _origin is the allowed client address
    if (whiteList.indexOf(_origin) !== -1 || !_origin) {
      callback(null, true)
    } else {
      callback(new Error(`address ${_origin} is not allowed by cors`))
    }
  },
  optionsSuccessStatus: 200
}

/* middlewares */
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }))
// built-in middleware to handle json data (x-www-form-urlencoded)
app.use(express.json())

// Routing Handler
app.use('/api', root)
/* Middleware */

process.on('uncaughtException', (err) => {
  console.log('whoops! there was an uncaughtException' + err)
  log.error(`${err} | ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
})

process.on('UnhandledPromiseRejectionWarning', (err) => {
  console.log('whoops! there was an UnhandledPromiseRejectionWarning' + err)
  log.error(`${err} | ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
})

app.get('/', (req, res) => {
  res.json({ message: 'Welcome in our NodeJS Api template' })
})

// Handling wildcard
app.get('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.json({ error: '404 Not Found' })
    // res.sendFile(path.join(__dirname, 'link to 404.html'))
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

// An error handling middleware
app.use((error, req, res, next) => {
  // Error gets here
  res.json({
    message: error.message
  })
})

app.listen(port, () => {
  console.log('server running at port ' + port)
})
