const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");

router.post("/", pedidosController.createOrder);
router.get("/", pedidosController.getAllOrders);
router.get("/filter", pedidosController.filterOrders);
router.get("/:id", pedidosController.getOrderById);
router.delete("/:id", pedidosController.deleteOrderById);
router.patch("/:id", pedidosController.editOrderById);

module.exports = router;
