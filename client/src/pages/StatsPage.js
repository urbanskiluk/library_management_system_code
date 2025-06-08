import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line,
  ResponsiveContainer
} from "recharts";


function StatsPage() {
  const [stats, setStats] = useState(null);
  const [genreData, setGenreData] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [monthlyAvgDuration, setMonthlyAvgDuration] = useState([]);
  const [loansByGenre, setLoansByGenre] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);

    axios.get("http://localhost:5000/api/stats/genre-distribution")
      .then(res => setGenreData(res.data))
      .catch(console.error);

    axios.get("http://localhost:5000/api/stats/top-authors")
      .then(res => setTopAuthors(res.data))
      .catch(console.error);

    axios.get("http://localhost:5000/api/stats/monthly-average-duration")
      .then(res => setMonthlyAvgDuration(res.data))
      .catch(console.error);

    axios.get("http://localhost:5000/api/stats/loans-by-genre")
      .then(res => setLoansByGenre(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p>Ładowanie statystyk...</p>;

  return (
    <div className="stats-page page">
      <Link to="/home">
        <button className="return-button general-button" style={{ marginBottom: "2rem" }}>
          <Home size={18} style={{ marginRight: '0.5rem' }} />
          Powrót do strony głównej
        </button>
      </Link>
      <h1>📊 Statystyki biblioteki</h1>

      <ul>
        <li><strong>📚 Całkowita liczba książek:</strong> {stats.books}</li>
        <li><strong>✅ Dostępne książki:</strong> {stats.available}</li>
        <li><strong>📕 Wypożyczone książki:</strong> {stats.checkedOut}</li>
        <li><strong>👤 Liczba użytkowników:</strong> {stats.users}</li>
        <li><strong>📖 Liczba wypożyczeń:</strong> {stats.loans}</li>
        <li><strong>⏳ Aktywne wypożyczenia:</strong> {stats.activeLoans}</li>
        <li><strong>💰 Łączna kwota opłaconych kar:</strong> {stats.totalFines.toFixed(2)} zł</li>
      </ul><br />

      <h3>📅 Wypożyczenia miesięcznie</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stats.loansByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer><br />

      <h3>📚 Książki według gatunków</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={genreData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer><br />

      <h3>📈 Autorzy z największą liczbą wypożyczeń</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topAuthors}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="author" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="loans" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer><br />

      <h3>📈 Średni czas wypożyczenia (dni) – miesięcznie</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyAvgDuration}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="avg_duration" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer><br />

      <h3>📚 Wypożyczenia według gatunków</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={loansByGenre}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsPage;
