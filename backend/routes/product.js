const express = require("express");
const productController = require("../controllers/admin/productController");
const router = express.Router();

router.route("/").get(productController.getAllProduct);
router.route("/:id").get(productController.getByID);
router.route("/category/:category_id").get(productController.getByCategory);

module.exports = router;
