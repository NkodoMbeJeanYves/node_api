// load .env variables
require('dotenv').config({ path: '.env' })
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080
const apiRouter = require('./app/routes/api')
const log4js = require('./app/config/log4js')
var log = log4js.getLogger('app') // enable logging
var consoleLog = require('./app/helpers/helpers').consoleLog

const whiteList = [ `${process.env.APP_URL}:${port}`, `http://127.0.0.1:${port}`, 'http://www.yoursite.com' ]
var corsOptions = {
  origin: (_origin, callback) => { // _origin is the allowed client address
    if (whiteList.indexOf(_origin) !== -1 || !_origin) {
      callback(null, true)
    } else {
      callback(new Error(`address ${_origin} is not allowed by cors`))
    }
  }, optionsSuccessStatus: 200
}

/* middlewares */
app.use(cors(corsOptions))
// get raw data as json
app.use(express.json())
// get raw data as body
app.use(express.urlencoded({ extended: true }))
// Router
app.use('/api/v1', apiRouter)
/* Middleware */

process.on('uncaughtException', err => {
  consoleLog('There was an uncaught error', err)
  log.error('There was an uncaught error', err)
  process.exit(1) // mandatory (as per the Node.js docs)
})

app.get('/', (req, res) => {
  res.json({ message: 'Welcome in our NodeJS Api template' })
})
app.listen(port, () => {
  console.log('server running at port ' + port)
})
