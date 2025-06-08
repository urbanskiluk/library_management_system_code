const express = require('express');
const cors = require('cors');
const db = require('./models/db');

require('dotenv').config();

const app = express();



app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authorRoutes = require('./routes/authors');
app.use('/api/authors', authorRoutes);

const loanRoutes = require('./routes/loans');
app.use('/api/loans', loanRoutes);

const statsRoutes = require("./routes/stats");
app.use("/api/stats", statsRoutes);

const genreRoutes = require("./routes/genres");
app.use("/api/genres", genreRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});