const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/', async (req, res) => {
  const { first_name, last_name } = req.body;
  if (!first_name || !last_name) {
    return res.status(400).json({ message: 'Imię i nazwisko są wymagane.' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO author (first_name, last_name) VALUES (?, ?)',
      [first_name, last_name]
    );
    res.status(201).json({ message: 'Autor dodany pomyślnie', author_id: result.insertId });
  } catch (error) {
    console.error('Błąd przy dodawaniu autora:', error);
    res.status(500).json({ message: 'Błąd serwera przy dodawaniu autora' });
  }
});

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM author');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu autorów' });
  }
});

module.exports = router;