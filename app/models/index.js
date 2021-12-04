const dbConfig = require('../config/dbConfig')
const { Sequelize, DataTypes } = require('sequelize')
const path = require('path')
const fs = require('fs')
const sync = process.env.SYNC

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      min: dbConfig.pool.min,
      max: dbConfig.pool.max,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
)

sequelize.authenticate()
  .then(() => console.log('connected'))
  .catch(err => console.log('error ' + err))

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

// table structure
// db.Product = require('./Product.js')(sequelize, DataTypes)
// db.Review = require('./Review.js')(sequelize, DataTypes)

// instead of above [table structure codes] we do : under models folder we get all files and initialize model corresponding to each file
fs.readdirSync(path.join(__dirname)).forEach(file => {
  var model = null
  if (file !== 'index.js' && file !== 'relatedModels.js') {
    model = require(path.join(__dirname, file))(sequelize, DataTypes)
    db[model.name] = model
  }
})

// load relation between models
require('./relatedModels')(db)

if (sync === true) {
  db.sequelize.sync({ force: true }) // sync database everytime app is running, wipe all table and re-create
    .then(() => {
      console.log('sync status: ' + sync)
    })
}

module.exports = db
