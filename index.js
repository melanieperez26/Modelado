// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const port = process.env.PORT || 3000;

const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// Cambia la ruta raíz para servir el index.html del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Guardar nuevo usuario y puntaje usando Supabase REST API
app.post('/api/scores', async (req, res) => {
  const { name, score } = req.body;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ name, score })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el puntaje en Supabase' });
  }
});

// Obtener top 10 puntajes usando Supabase REST API
app.get('/api/highscores', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scores?select=*&order=score.desc&limit=10`, {
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los puntajes de Supabase' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
