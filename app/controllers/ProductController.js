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
  /* const products = await Product.findAll({
    attributes: [
      'title',
      'price'
    ]
  }) */
  var responseObject = {
    error: {},
    msg: '',
    data: null,
    status: true
  }
  log.debug(`Fetching products. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
  await Product.findAll().then(
    (products) => {
      responseObject.data = products
      res.status(200).json(responseObject)
    }
  ).catch(err => {
    log.debug(`Error:${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
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
    error: {},
    msg: '',
    data: null,
    status: true
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

      await Product.create(info, { transaction }).then(newProduct => {
        responseObject.data = newProduct.dataValues
        consoleLog(responseObject.data)
        log.info(`New product created. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
        return res.status(201).json(responseObject)
      }).catch(err => {
        log.debug(`Error:${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
        responseObject.error = err
        throw new Error(err)
      })
    })
    // redirect after successfull commit
    return res.status(201).json(responseObject)
  } catch (error) {
    log.debug(`Error:${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    error.errors.map(er => {
      validationError[er.path] = er.message
    })
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
    error: {},
    msg: '',
    data: null,
    status: true
  }

  try {
    const id = req.params.id
    await Product.findOne({ where: { id: id } }).then(
      (updated) => {
        responseObject.data = updated.datavalues
        return res.status(200).json(responseObject)
      }
    ).catch(error => {
      log.debug(`Error:${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
      responseObject.status = false
      responseObject.msg = 'item not found with id: ' + id
      responseObject.error = error
      throw new Error(error)
    })
  } catch (error) {
    log.debug(`Error:${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    return res.status(400).json(responseObject)
  }
}

/**
 *  @description Update specific product
 *  @route PATCH /api/v1/product/:id
 */
const update = async (req, res) => {
  var responseObject = {
    error: {},
    msg: '',
    data: null,
    status: true
  }
  const id = req.params.id
  await Product.update(req.body, { where: { id: id } }) // { fields: ['column_1', 'column_2',], where: { id: id } }
    .then(
      (updated) => {
        consoleLog(updated)
        responseObject.data = updated
        res.status(200).json(responseObject)
      }
    ).catch(error => {
      consoleLog(error)
      responseObject.error = error
      responseObject.status = false
      res.status(200).json(responseObject)
    })
}

/**
 *  @description Destroy specific product
 *  @route delete /api/v1/product/:id
 */
const destroy = async (req, res) => {
  var responseObject = {
    error: {},
    msg: '',
    data: null,
    status: true
  }
  const id = req.params.id
  await Product.find({
    where: { id: id }
  }).then(
    (product) => {
      log.debug(`Product found before deletion. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    }
  ).catch(error => {
    log.debug(`Error:${error}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
    responseObject.status = false
    responseObject.msg = 'item not found with id: ' + id
    return res.status(400).json(responseObject)
  })

  await Product.destroy({ where: { id: id } }).then(
    (product) => {
      consoleLog(product)
      responseObject.msg = 'product successfully deleted'
      res.status(200).json(responseObject)
    }
  ).catch(err => {
    log.debug(`Error:${err}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
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
