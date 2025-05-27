'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // Car belongs to User
      Car.belongsTo(models.User, { foreignKey: 'UserId' });
      // Car belongs to Category
      Car.belongsTo(models.Category, { foreignKey: 'CategoryId' });
    }
  }
  Car.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'UserId is required'
        },notNull: {
          msg: 'UserId is required'
        }
      },
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Brand is required'
        },
        notNull: {
          msg: 'Brand is required'
        }
      }
    },
    Type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Type is required'
        }, notNull: {
          msg: 'Type is required'
        }
      }
    }, 
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Condition is required'
        },
        notNull: {
          msg: 'Condition is required'
        }
      }
    },
    fuel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Fuel is required'
        },
        notNull: {
          msg: 'Fuel is required'
        }
      }
    },
    features: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Features is required'
        },
        notNull: {
          msg: 'Features is required'
        }
      }
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Price is required'
        },
        notNull: {
          msg: 'Price is required'
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category is required'
        },
        notNull: {
          msg: 'Category is required'
        }
      },
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};