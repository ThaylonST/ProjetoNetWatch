require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("API NetWatch rodando!");
});

const find = require('local-devices');

// ROTA PARA ESCANEAR A REDE
app.get('/scan', async (req, res) => {
  try {
    const devices = await find(); // lista todos os dispositivos detectados
    res.json({
      total: devices.length,
      devices: devices
    });
  } catch (error) {
    console.error("Erro ao escanear rede:", error);
    res.status(500).json({ error: "Erro ao escanear rede" });
  }
});

// --- deixar o listen por último ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
