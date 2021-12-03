// load .env variables
require('dotenv').config({ path: '.env' })
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 8080
const apiRouter = require('./routes/api')

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
app.get('/', (req, res) => {
  res.json({ message: 'Welcome in our NodeJS Api template' })
})
app.listen(port, () => {
  console.log('server running at port ' + port)
})
