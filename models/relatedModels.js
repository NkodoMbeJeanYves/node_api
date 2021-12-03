module.exports = (db) => {
  // The model will now be available in models under the class name
  db.Product.hasMany(db.Review, { as: 'reviews', foreignKey: 'product_id' })
}
