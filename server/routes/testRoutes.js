const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

// Realizar teste de ping real
router.post("/:id/test", testController.runPingTest);

// Histórico de testes
router.get("/:id", testController.listTests);

module.exports = router;
