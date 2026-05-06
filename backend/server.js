const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send("Servidor funcionando");
});

app.get('/productos', (req, res) => {
  res.json([
    {
      id: 1,
      nombre: "Producto prueba",
      precio: 50,
      imagen: "https://via.placeholder.com/300"
    }
  ]);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});