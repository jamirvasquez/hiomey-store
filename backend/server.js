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
        console.error('Error de conexión:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// ruta productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});