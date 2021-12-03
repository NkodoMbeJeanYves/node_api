// autoload index.js
const db = require('../models')
const log4js = require('../config/log4js')
var log = log4js.getLogger('app')

// create main Model
const Product = db.Product

// Methods

const index = async (req, res) => {
  /* const products = await Product.findAll({
    attributes: [
      'title',
      'price'
    ]
  }) */
  log.debug('Fetching products')
  const products = await Product.findAll()
  res.status(200).json(products)
}

const store = async (req, res) => {
  const info = {
    title: req.body.title,
    price: req.body.price,
    reference: req.body.reference,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  }

  log.info('new product created')
  const product = await Product.create(info)
  res.status(201).send(product)
}

const edit = async (req, res) => {
  const id = req.params.id
  const product = await Product.findOne({ where: { id: id } })
  if (product) {
    log.info('product found, id: ' + id)
  } else {
    log.info('product not found, id: ' + id)
  }

  res.status(200).send(product)
}

const update = async (req, res) => {
  const id = req.params.id
  const product = await Product.update(req.body, { where: { id: id } })
  res.status(200).send(product)
}

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
  log.debug('product deleted, id: ' + id)
  res.status(200).send('product deleted')
}

module.exports = {
  index,
  store,
  edit,
  update,
  destroy
}
