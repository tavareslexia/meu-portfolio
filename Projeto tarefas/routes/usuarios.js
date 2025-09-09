const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.createUser);
router.get("/", usuarioController.getAllUsers);
router.get("/:id", usuarioController.getUserById);
router.patch("/:id", usuarioController.updateUser);
router.delete("/:id", usuarioController.deleteUser);
router.post("/login", usuarioController.login);

module.exports = router;
