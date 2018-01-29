'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'order',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      address: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      currency: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING
    }
    // {
    //   classMethods: {
    //     associate: function(models) {
    //       // associations can be defined here
    //       Order.belongsTo(models.User);
    //       Order.hasOne(models.Cart);
    //     }
    //   }
    // }
  );

  Order.associate = models => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    Order.hasOne(models.Cart, {
      foreignKey: 'orderId'
    });
  };

  return Order;
};
