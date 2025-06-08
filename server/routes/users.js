const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user WHERE user_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd serwera przy pobieraniu użytkownika' });
  }
});

router.post('/', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    street,
    house_number,
    postal_code,
    city,
    country
  } = req.body;

  if (!first_name || !last_name || !email) {
    return res.status(400).json({ message: 'Brakuje wymaganych danych' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO user 
        (first_name, last_name, email, phone_number, street, house_number, postal_code, city, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone_number, street, house_number, postal_code, city, country]
    );

    res.status(201).json({
      message: 'Użytkownik dodany pomyślnie',
      user_id: result.insertId
    });
  } catch (error) {
    console.error('Błąd przy dodawaniu użytkownika:', error);
    res.status(500).json({ message: 'Błąd serwera podczas dodawania użytkownika' });
  }
});

router.put('/:id', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone_number,
    street,
    house_number,
    postal_code,
    city,
    country
  } = req.body;

  try {
    await db.query(
      `UPDATE user SET
        first_name = ?,
        last_name = ?,
        email = ?,
        phone_number = ?,
        street = ?,
        house_number = ?,
        postal_code = ?,
        city = ?,
        country = ?
      WHERE user_id = ?`,
      [first_name, last_name, email, phone_number, street, house_number, postal_code, city, country, req.params.id]
    );
    res.json({ message: 'Użytkownik zaktualizowany' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd przy aktualizacji użytkownika' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM user WHERE user_id = ?', [req.params.id]);
    res.json({ message: 'Użytkownik usunięty' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd podczas usuwania użytkownika' });
  }
});

module.exports = router;
