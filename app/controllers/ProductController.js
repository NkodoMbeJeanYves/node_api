// autoload index.js
const db = require('../models')
var consoleLog = require('../helpers/helpers').consoleLog // output into console regarding .env Log flag
const log4js = require('../config/log4js')
var log = log4js.getLogger('app') // enable logging
const pkg = require('get-current-line').default // get current script filename and line
var path = require('path')
var validationError = {}
// create main Model
const Product = db.Product

// Methods
/**
 *  @description Fetch products
 *  @route GET /api/v1/product
 */
const index = async (req, res) => {
  // consoleLog(test_global)
  var responseObject = {
    status: true,
    data: null,
    error: {},
    msg: ''
  }

  await Product.findAll({ attributes: ['id', 'reference', 'title', 'price', 'description', 'published'], include: { model: db.Review, as: 'Reviews', foreignKey: 'product_id' } }).then(
    (products) => {
      responseObject.data = products
      log.debug(JSON.stringify(products.groupByField('published')))
      log.info(`Fetching products. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
      res.status(200).json(responseObject)
    }
  ).catch(err => {
    consoleLog(err)
    log.error(`${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    responseObject.error = err
    responseObject.status = false
    res.status(400).json(responseObject)
  })
}

/**
 *  @description Store new product
 *  @route POST /api/v1/product
 */
const store = async (req, res) => {
  var responseObject = {
    status: true,
    data: null,
    error: {},
    msg: ''
  }

  try {
    await db.sequelize.transaction(async (transaction) => {
      const info = {
        title: req.body.title,
        price: req.body.price,
        reference: req.body.reference,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
      }

      await Product.create(info, { fields: ['title', 'reference', 'description', 'price', 'published'], transaction }).then(newProduct => {
        responseObject.data = newProduct.dataValues
        consoleLog(responseObject.data)
        log.info(`New product created. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
        return res.status(201).json(responseObject)
      }).catch(err => { // SequelizeValidationError
        throw (err)
      })
    })
  } catch (error) {
    if (error.name !== 'SequelizeValidationError') {
      validationError = error
    } else {
      error.errors.map(er => {
        validationError[er.path] = er.message
      })
    }
    log.error(`${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)

    responseObject.error = validationError
    responseObject.status = false

    return res.status(400).json(responseObject)
  }
}

/**
 *  @description Fetch specific product
 *  @route GET /api/v1/product/:id
 */
const edit = async (req, res) => {
  var responseObject = {
    status: true,
    data: null,
    error: {},
    msg: ''
  }

  try {
    const id = req.params.id
    await Product.findOne({ where: { id: id }, include: { model: db.Review, as: 'Reviews' } }).then(
      (updated) => {
        if (updated === null) {
          throw new Error('product not found')
        }

        responseObject.data = updated.dataValues
        return res.status(200).json(responseObject)
      }
    ).catch(error => {
      throw new Error(error)
    })
  } catch (error) {
    log.error(`${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    responseObject.status = false
    responseObject.error = error
    return res.status(400).json(responseObject)
  }
}

/**
 *  @description Update specific product
 *  @route PATCH /api/v1/product/:id
 */
const update = async (req, res) => {
  var responseObject = {
    status: true,
    data: null,
    error: {},
    msg: ''
  }
  try {
    await db.sequelize.transaction(
      async (transaction) => {
        const id = req.params.id
        await Product.update(req.body, { where: { id: id }, fields: ['title', 'description', 'price', 'published'], transaction }) // { fields: ['column_1', 'column_2',], where: { id: id } }
          .then(
            (updated) => {
              consoleLog(updated)
              log.info(`Product updated, id: ${id}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
              responseObject.data = updated
              res.status(200).json(responseObject)
            }
          ).catch(error => {
            throw error
          })
      })
  } catch (err) {
    if (err.name !== 'SequelizeValidationError') {
      validationError = err
    } else {
      err.errors.map(er => {
        validationError[er.path] = er.message
      })
    }
    log.error(`${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    consoleLog(err)
    responseObject.error = validationError
    responseObject.status = false

    res.status(400).json(responseObject)
  }
}

/**
 *  @description Destroy specific product
 *  @route delete /api/v1/product/:id
 */
const destroy = async (req, res) => {
  var responseObject = {
    status: true,
    data: null,
    error: {},
    msg: ''
  }
  const id = req.params.id
  await Product.findOne({
    where: { id: id }
  }).then(
    (product) => {
      if (product === null) {
        log.debug(`Product not found, id: ${id}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
        throw new Error('Product not found')
      } else {
        deleteProductAsync(responseObject, id, res)
      }
    }
  ).catch(error => {
    log.debug(`${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    responseObject.status = false
    responseObject.msg = error
    return res.status(400).json(responseObject)
  })
}

const deleteProductAsync = async (responseObject, id, res) => {
  await Product.destroy({ where: { id: id } }).then(
    (product) => {
      consoleLog(product)
      responseObject.msg = 'product successfully deleted'
      res.status(200).json(responseObject)
    }
  ).catch(err => {
    log.debug(`${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    responseObject.status = false
    res.status(400).json(responseObject)
  })
}

module.exports = {
  index,
  store,
  edit,
  update,
  destroy
}
