const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());

// conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hiomey_db'
});

db.connect(err => {
    if (err) {
        console.log('⚠️ MySQL no conectado, pero servidor sigue funcionando');
    } else {
        console.log('Conectado a MySQL');
    }
});

// ruta productos
app.get('/productos', (req, res) => {

    db.query('SELECT * FROM productos', (err, result) => {

        if (err) {
            console.log("Error BD:", err);

            // 👇 RESPUESTA DE PRUEBA
            return res.json([
                {
                    id: 1,
                    nombre: "Producto prueba",
                    precio: 50,
                    imagen: "https://via.placeholder.com/300"
                }
            ]);
        }

        res.json(result);
    });

});

// ✅ SOLO ESTE LISTEN (correcto)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});