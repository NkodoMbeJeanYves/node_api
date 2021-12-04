module.exports = (db) => {
  // The model will now be available in models under the class name
  // Product 1 To n Review
  /*
  * The possible choices are RESTRICT, CASCADE, NO ACTION, SET DEFAULT and SET NULL.
  */
  db.Product.hasMany(db.Review, { as: 'Reviews', onDelete: 'CASCADE', onUpdate: 'RESTRICT' })
  db.Review.belongsTo(db.Product)
}
