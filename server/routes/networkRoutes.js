const express = require("express");
const router = express.Router();
const find = require("local-devices");

router.get("/scan", async (req, res) => {
  try {
    const devices = await find();
    res.json({
      total: devices.length,
      devices: devices.map(d => ({
        name: d.name || "?",
        ip: d.ip,
        mac: d.mac
      }))
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao escanear rede" });
  }
});

module.exports = router;