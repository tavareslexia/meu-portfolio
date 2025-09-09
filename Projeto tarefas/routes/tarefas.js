const express = require("express");
const router = express.Router();
const tarefaController = require("../controllers/tarefaController");

// Em vez de colocar a função de callback aqui, chamamos uma do controller
router.post("/", tarefaController.createTask);
router.get("/", tarefaController.getAllTasks);
router.get("/:id", tarefaController.getTaskById);
router.delete("/:id", tarefaController.deleteTaskById);
router.patch("/:id", tarefaController.editTaskById);
//... e assim por diante para as outras rotas

module.exports = router;
