//controllers/deviceController.js
const db = require("../database");
const ping = require("ping");

// Listar todos os dispositivos com último status
const getAllDevices = (req, res) => {
  const query = `
    SELECT d.*,
           t.status as lastStatus,
           t.latency as lastLatency,
           t.timestamp as lastTestTime
    FROM devices d
    LEFT JOIN (
      SELECT device_id, status, latency, timestamp,
             ROW_NUMBER() OVER (PARTITION BY device_id ORDER BY timestamp DESC) as rn
      FROM tests
    ) t ON d.id = t.device_id AND t.rn = 1
    ORDER BY d.created_at DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      console.error("Erro no SQL:", err);
      return res.status(500).json({ error: err.message });
    }

    const devicesWithStatus = rows.map(device => ({
      ...device,
      lastStatus: device.lastStatus || "down",
      lastLatency: device.lastLatency || null
    }));

    res.json(devicesWithStatus);
  });
};

// Criar dispositivo
const createDevice = (req, res) => {
  const { name, ip_address, type } = req.body;
  if (!name || !ip_address) {
    return res.status(400).json({ error: "Nome e IP são obrigatórios" });
  }

  db.run(
    "INSERT INTO devices (name, ip_address, type) VALUES (?, ?, ?)",
    [name, ip_address, type || null],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, ip_address, type });
    }
  );
};

// Testar ping
const testDevice = async (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM devices WHERE id = ?", [id], async (err, device) => {
    if (err || !device) return res.status(404).json({ error: "Dispositivo não encontrado" });

    try {
      const result = await ping.promise.probe(device.ip_address, {
        timeout: 10,
        extra: ["-n", "3"]
      });

      const status = result.alive ? "up" : "down";
      const latency = result.alive ? Math.round(result.avg || result.time) : null;

      db.run(
        "INSERT INTO tests (device_id, status, latency) VALUES (?, ?, ?)",
        [id, status, latency],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({
            device_id: id,
            status,
            latency,
            timestamp: new Date().toISOString()
          });
        }
      );
    } catch (error) {
      db.run("INSERT INTO tests (device_id, status, latency) VALUES (?, ?, ?)", [id, "down", null]);
      res.json({ device_id: id, status: "down", latency: null });
    }
  });
};

// Histórico do dispositivo
const getDeviceTests = (req, res) => {
  const { id } = req.params;
  db.all(
    "SELECT * FROM tests WHERE device_id = ? ORDER BY timestamp DESC",
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
};

// 🔥 NOVO: DELETAR dispositivo + limpar histórico
const deleteDevice = (req, res) => {
  const { id } = req.params;

  // Primeiro remove os testes
  db.run("DELETE FROM tests WHERE device_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Erro ao remover testes" });

    // Depois remove o dispositivo
    db.run("DELETE FROM devices WHERE id = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: "Erro ao remover dispositivo" });

      if (this.changes === 0) {
        return res.status(404).json({ error: "Dispositivo não encontrado" });
      }

      res.json({ success: true, message: "Dispositivo removido com sucesso" });
    });
  });
};

module.exports = {
  getAllDevices,
  createDevice,
  testDevice,
  getDeviceTests,
  deleteDevice,
};
