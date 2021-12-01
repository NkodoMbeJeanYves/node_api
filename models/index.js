const dbConfig = require('../config/dbConfig')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

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
db.products = require('./Product.js')(sequelize, DataTypes)
// db.reviews = require('./Review.js')(sequelize, DataTypes)

db.sequelize.sync({ force: false }) // sync database everytime app is running, wipe all table and re-create
  .then(() => {
    console.log('yes re-sync done!')
  })

module.exports = db
