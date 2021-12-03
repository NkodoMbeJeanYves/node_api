// autoload index.js
const db = require('../models')
const log4js = require('../config/log4js')
var log = log4js.getLogger('app') // enable logging
const pkg = require('get-current-line').default // getScript filename and line
var path = require('path')
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
  log.debug(`Fetching products. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
  const products = await Product.findAll()
  res.status(200).json(products)
}

/**
 *  @description Store new product
 *  @route POST /api/v1/product
 */
const store = async (req, res) => {
  const info = {
    title: req.body.title,
    price: req.body.price,
    reference: req.body.reference,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  }

  log.info(`New product created. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
  const product = await Product.create(info)
  res.status(201).send(product)
}

/**
 *  @description Fetch specific product
 *  @route GET /api/v1/product/:id
 */
const edit = async (req, res) => {
  const id = req.params.id
  const product = await Product.findOne({ where: { id: id } })
  if (product) {
    log.info(`Product found, id: ${id}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
  } else {
    log.info('product not found, id: ' + id)
  }

  res.status(200).send(product)
}

/**
 *  @description Update specific product
 *  @route PATCH /api/v1/product/:id
 */
const update = async (req, res) => {
  const id = req.params.id
  const product = await Product.update(req.body, { where: { id: id } })
  res.status(200).send(product)
}

/**
 *  @description Destroy specific product
 *  @route delete /api/v1/product/:id
 */
const destroy = async (req, res) => {
  const id = req.params.id
  const product = await Product.find({
    where: { id: id }
  })
  if (product) {
    log.info('product found, id: ' + id)
  } else {
    log.info('product not found, id: ' + id)
  }
  await Product.destroy({ where: { id: id } })
  log.debug(`Product deleted, id:${id}. ${path.basename(pkg().file, '.js')}@${pkg().method}:${pkg().line}`)
  res.status(200).send('product deleted')
}

module.exports = {
  index,
  store,
  edit,
  update,
  destroy
}
