require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const devicesRoutes = require("./routes/devicesRoutes");
const networkRoutes = require("./routes/networkRoutes");

app.use("/devices", devicesRoutes);
app.use("/network", networkRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor NetWatch rodando!");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});