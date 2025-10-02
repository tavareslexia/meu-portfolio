const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinhoController");

router.post("/", carrinhoController.createCarrinho);
router.get("/", carrinhoController.getAllCarrinho);
router.delete("/", carrinhoController.deleteCarrinho);
router.get("/:id", carrinhoController.getItemByIdCarrinho);
router.delete("/:id", carrinhoController.deleteItemByIdCarrinho);
router.patch("/:id", carrinhoController.editItemByIdCarrinho);

module.exports = router;
