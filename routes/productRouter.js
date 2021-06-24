const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// http://localhost:4000/api/v1/products
router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.addProduct);

router.route("/cartItems").get(productController.getCartItems);

router
  .route("/:id")
  .get(productController.getSingleProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
