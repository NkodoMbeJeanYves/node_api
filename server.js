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

// built-in middleware to handle urlencoded data (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true}))
// built-in middleware to handle json data (x-www-form-urlencoded)
app.use(express.json())

// Router
/* apiRouter.use((err, req, res, next) => {
    if (! err) {
        return next();
    }
    consoleLog('There was an uncaught error', err.stack)
    log.error('There was an uncaught error', err.stack)
    // process.exit(1) // mandatory (as per the Node.js docs)
    res.status(500);
    res.send('500: Internal server error');
}) */

app.use('/api/v1', apiRouter)
/* Middleware */

/* process.on('UnhandledPromiseRejectionWarning', err => {
  consoleLog('There was an uncaught error', err)
  log.error('There was an uncaught error', err)
  process.exit(1) // mandatory (as per the Node.js docs)
}) */

// Handle errors
/* app.use((err, req, res, next) => {
    if (! err) {
        return next();
    }
    consoleLog('There was an uncaught error', err.stack)
    log.error('There was an uncaught error', err.stack)
    // process.exit(1) // mandatory (as per the Node.js docs)
    res.status(500);
    res.send('500: Internal server error');
}); */

app.get('/', (req, res) => {
  res.json({ message: 'Welcome in our NodeJS Api template' })
})
app.listen(port, () => {
  console.log('server running at port ' + port)
})
