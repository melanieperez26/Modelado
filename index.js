// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();


const port = process.env.PORT || 8080;

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// Cambia la ruta raíz para servir el index.html del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Guardar nuevo usuario y puntaje
app.post('/api/score', async (req, res) => {
  const { name, score } = req.body;
  try {
    const newScore = await prisma.score.create({
      data: { name, score }
    });
    res.json(newScore);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el puntaje' });
  }
});

// Obtener top 10 puntajes
app.get('/api/highscores', async (req, res) => {
  const top = await prisma.score.findMany({
    orderBy: { score: 'desc' },
    take: 10
  });
  res.json(top);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
