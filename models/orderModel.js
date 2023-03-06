const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  item: [
    {
      products: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Order must have a product"],
        },
      ],
      totalPrice: Number,
      totalQuantity: Number,
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a User!"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name id -cart" }).populate({
    path: "item",
    populate: {
      path: "products",
      select: "id name price",
    },
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
