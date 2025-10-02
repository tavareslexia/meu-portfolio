const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

router.post("/", produtosController.createProduct);
router.get("/", produtosController.getAllProducts);
router.get("/filter/:nome", produtosController.getProductsByFilter);
router.get("/category/:id", produtosController.getProductsByCategory);
router.get("/:id", produtosController.getProductById);
router.delete("/:id", produtosController.deleteProductById);
router.patch("/:id", produtosController.editProductById);

module.exports = router;
