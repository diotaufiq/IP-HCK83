'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    static associate(models) {
      // WishlistItem belongs to a User
      WishlistItem.belongsTo(models.User, { foreignKey: 'UserId' });
      // WishlistItem belongs to a Car
      WishlistItem.belongsTo(models.Car, { foreignKey: 'CarId' });
    }
  }
  WishlistItem.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' } // Pastikan model 'Users' sudah benar
    },
    CarId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Cars', key: 'id' } // Pastikan model 'Cars' sudah benar
    }
  }, {
    sequelize,
    modelName: 'WishlistItem',
    // tableName: 'WishlistItems' // Jika nama tabel berbeda dari modelName + 's'
  });
  return WishlistItem;
};