'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {
    items: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0
    },
    products: {
      type: DataTypes.VIRTUAL,
      defaultValue: {}
    }
  });

  Cart.associate = models => {
    Cart.belongsTo(models.Order, {
      foreignKey: 'orderId'
    });

    Cart.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };

  Cart.prototype.add = function(product, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { qty: 0, price: 0 };
      this.products[id] = product.dataValues;
    }

    storedItem.qty++;
    storedItem.price = product.price * storedItem.qty;
    this.totalQuantity++;
    this.totalPrice += product.price;
    return this;
  };

  Cart.prototype.reduceByOne = function(productPrice, id) {
    this.items[id].qty--;
    this.items[id].price -= productPrice;
    this.totalQuantity--;
    this.totalPrice -= productPrice;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  Cart.prototype.remove = function(id) {
    this.totalQuantity -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  return Cart;
};
