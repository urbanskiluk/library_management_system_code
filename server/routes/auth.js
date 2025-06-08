const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

const readUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  let users = [];
  try {
    users = readUsers();
  } catch (err) {
    console.error('Błąd odczytu pliku users.json:', err);
  }

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  const newUser = { username, password };
  users.push(newUser);

  try {
    writeUsers(users);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Błąd zapisu do pliku users.json:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let users = [];
  try {
    users = readUsers();
  } catch (err) {
    console.error('Błąd odczytu pliku users.json:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }

  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful.' });
  } else {
    res.status(401).json({ message: 'Niepoprawne dane logowania!' });
  }
});

module.exports = router;