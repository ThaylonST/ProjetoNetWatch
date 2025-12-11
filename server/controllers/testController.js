const db = require("../config/db");
const ping = require("../utils/ping");

module.exports = {
  runPingTest: async (req, res) => {
    const deviceId = req.params.id;

    db.query("SELECT * FROM devices WHERE id = ?", [deviceId], async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Device não encontrado" });

      const device = results[0];

      const result = await ping(device.ip_address);

      // Salvar log
      db.query(
        "INSERT INTO tests (device_id, status, latency) VALUES (?, ?, ?)",
        [deviceId, result.status, result.latency],
        (err) => {
          if (err) return res.status(500).json({ error: err });

          res.json({
            message: "Teste realizado",
            device: device.name,
            result,
          });
        }
      );
    });
  },

  listTests: (req, res) => {
    const deviceId = req.params.id;

    db.query(
      "SELECT * FROM tests WHERE device_id = ? ORDER BY timestamp DESC",
      [deviceId],
      (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
      }
    );
  },
};
