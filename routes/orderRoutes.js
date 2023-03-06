const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route('/').post(orderController.setOrderUserIds, orderController.createOrder)

router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(orderController.getAllOrders)

router
  .route("/:id")
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
