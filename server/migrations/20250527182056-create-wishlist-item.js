'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WishlistItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Sebaiknya tidak null, karena wishlist item harus dimiliki user
        references: {
          model: 'Users', // Nama tabel Users Anda
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Jika User dihapus, wishlist item-nya juga terhapus
      },
      CarId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Sebaiknya tidak null, karena wishlist item harus merujuk ke mobil
        references: {
          model: 'Cars',  // Nama tabel Cars Anda
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Jika Car dihapus, wishlist item-nya juga terhapus
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Tambahkan unique constraint agar satu user tidak bisa menambahkan mobil yang sama berkali-kali
    await queryInterface.addConstraint('WishlistItems', {
      fields: ['UserId', 'CarId'],
      type: 'unique',
      name: 'unique_user_car_wishlist_constraint' // Beri nama yang deskriptif untuk constraint
    });
  },

  async down(queryInterface, Sequelize) {
    // Hapus constraint terlebih dahulu sebelum drop table
    await queryInterface.removeConstraint('WishlistItems', 'unique_user_car_wishlist_constraint');
    await queryInterface.dropTable('WishlistItems');
  }
};