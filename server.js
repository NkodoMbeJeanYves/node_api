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

var corsOptions = {
  origin: 'http://localhost:3000'
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
