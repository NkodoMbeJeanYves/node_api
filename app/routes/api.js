const ProductController = require('../controllers/ProductController')
// const asyncTryCatchMiddleware = require('./root').asyncTryCatchMiddleware
const router = require('express').Router()
let prefix = 'product'

// Product
/* router.get(`/${prefix}`, ProductController.index)
router.post(`/${prefix}`, ProductController.store)
router.get(`/${prefix}/:id`, ProductController.edit)
router.patch(`/${prefix}/:id`, ProductController.update)
router.delete(`/${prefix}/:id`, ProductController.destroy) */

router.route(`/${prefix}`)
  .get(ProductController.index)
  .post(ProductController.store)

router.route(`/${prefix}/:id`)
  .get(ProductController.edit)
  .patch(ProductController.update)
  .delete(ProductController.destroy)

// another model binding
prefix = 'another model'
module.exports = router
