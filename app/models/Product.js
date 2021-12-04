module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true,
        isAlphanumeric: true,
        len: { args: [4, 15], msg: 'reference has to between 4 and 15 characters' }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: { args: true, msg: 'The price must be numeric' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    timestamps: true,
    // I want updatedAt to actually be called updateTimestamp
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    sequelize
  })

  return Product
}
