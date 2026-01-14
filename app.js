const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// conexión MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
  } else {
    console.log('Conectado a MySQL');
  }
});

// listar usuarios
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// crear usuario
app.post('/usuarios', (req, res) => {
  const { nombre, correo } = req.body;
  db.query(
    'INSERT INTO usuarios (nombre, correo) VALUES (?, ?)',
    [nombre, correo],
    () => res.redirect('/')
  );
});

// eliminar usuario
app.get('/usuarios/eliminar/:id', (req, res) => {
  db.query(
    'DELETE FROM usuarios WHERE id = ?',
    [req.params.id],
    () => res.redirect('/')
  );
});

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});

// Mostrar formulario de edición

// Ruta para mostrar la vista editar
app.get('/usuarios/editar/:id', (req, res) => {
  res.sendFile(__dirname + '/public/editar.html');
});

//  Ruta API para obtener un usuario
app.get('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});


// Actualizar usuario
app.post('/usuarios/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;

  db.query(
    'UPDATE usuarios SET nombre = ?, correo = ? WHERE id = ?',
    [nombre, correo, id],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

