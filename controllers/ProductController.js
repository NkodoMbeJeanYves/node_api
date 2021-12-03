// autoload index.js
const db = require('../models')

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

  const product = await Product.create(info)
  res.status(201).send(product)
}

const edit = async (req, res) => {
  const id = req.params.id
  const product = await Product.findOne({ where: { id: id } })
  res.status(200).send(product)
}

const update = async (req, res) => {
  const id = req.params.id
  const product = await Product.update(req.body, { where: { id: id } })
  res.status(200).send(product)
}

const destroy = async (req, res) => {
  const id = req.params.id
  await Product.destroy({ where: { id: id } })
  res.status(200).send('product deleted')
}

module.exports = {
  index,
  store,
  edit,
  update,
  destroy
}
