const express = require("express");
const router = express.Router();
const itensController = require("../controllers/itensController");

router.post("/", itensController.createItem);
router.get("/", itensController.getAllItems);
router.get("/order/:id", itensController.getItemByOrder);
router.get("/:id", itensController.getItemById);
router.delete("/:id", itensController.deleteItemById);
router.patch("/:id", itensController.editItemById);

module.exports = router;
