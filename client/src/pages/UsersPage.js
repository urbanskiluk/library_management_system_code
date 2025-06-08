import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Home, Edit2, Trash2, PlusCircle, } from 'lucide-react';
import "../style/App.css";

function formatDate(dateString) {
  return format(new Date(dateString), "yyyy-MM-dd");
}

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
      setSelectedId(null);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = () => {
    if (selectedId) {
      navigate(`/users/edit/${selectedId}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const confirmDelete = window.confirm("Czy na pewno chcesz usunąć użytkownika?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${selectedId}`);
        fetchUsers();
      } catch (error) {
        console.error("Błąd przy usuwaniu użytkownika:", error);
      }
    }
  };

  return (
    <div className="user-page page">
      <Link to="/home">
        <button className="return-button general-button">
          <Home size={18} style={{ marginRight: '0.5rem' }} />
          Powrót do strony głównej
        </button>
      </Link><br /><br />

      <h1>Lista użytkowników</h1>

      {users.length === 0 ? (
        <p>Brak użytkowników do wyświetlenia.</p>
      ) : (
        <div>
          <table className="general-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>E-mail</th>
                <th>Numer telefonu</th>
                <th>Ulica</th>
                <th>Nr domu/mieszkania</th>
                <th>Kod pocztowy</th>
                <th>Miasto</th>
                <th>Kraj</th>
                <th>Data rejestracji</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.user_id}
                  onClick={() => setSelectedId(user.user_id)}
                  style={{
                    backgroundColor:
                      user.user_id === selectedId ? "#d3d3d3" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{user.user_id}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone_number}</td>
                  <td>{user.street}</td>
                  <td>{user.house_number}</td>
                  <td>{user.postal_code}</td>
                  <td>{user.city}</td>
                  <td>{user.country}</td>
                  <td>{formatDate(user.registration_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/users/add")} className="general-button">
              <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
              Dodaj
            </button>
            <button className="general-button" onClick={handleEdit} disabled={!selectedId}>
              <Edit2 size={18} style={{ marginRight: '0.5rem' }} />
              Edytuj
            </button>
            <button className="logout-button general-button" onClick={handleDelete} disabled={!selectedId}>
              <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
              Usuń
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersPage;
