const express = require("express");
const router = express.Router();
const categoriasController = require("../controllers/categoriasController");

router.post("/", categoriasController.createCategory);
router.get("/", categoriasController.getAllCategories);
router.get("/:id", categoriasController.getCategoryById);
router.delete("/:id", categoriasController.deleteCategoryById);
router.patch("/:id", categoriasController.editCategoryById);

module.exports = router;
