// server/controllers/networkController.js
const find = require("local-devices");

const scanNetwork = async (req, res) => {
  try {
    const devices = await find();
    
    // Formata bonitinho igual antes
    const formattedDevices = devices.map(d => ({
      name: d.name || "?",
      ip: d.ip,
      mac: d.mac
    }));

    res.json({
      total: formattedDevices.length,
      devices: formattedDevices
    });
  } catch (error) {
    console.error("Erro no scan:", error);
    res.status(500).json({ error: "Erro ao escanear a rede" });
  }
};

module.exports = { scanNetwork };