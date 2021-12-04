module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
