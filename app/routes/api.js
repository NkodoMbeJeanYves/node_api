const ProductController = require('../controllers/ProductController')

const router = require('express').Router()
let prefix = 'product'

// Product
router.get(`/${prefix}`, ProductController.index)
router.post(`/${prefix}`, ProductController.store)
router.get(`/${prefix}/:id`, ProductController.edit)
router.patch(`/${prefix}/:id`, ProductController.update)
router.delete(`/${prefix}/:id`, ProductController.destroy)

// another model binding
prefix = 'another model'
module.exports = router
