import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Home, Edit2, Trash2, PlusCircle, } from 'lucide-react';
import "../style/App.css";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/books");
      setBooks(res.data);
      setSelectedId(null);
    } catch (error) {
      console.error("Błąd podczas pobierania książek:", error);
    }
  };

  const handleEdit = () => {
    if (selectedId) {
      navigate(`/books/edit/${selectedId}`);
    }
  };

  const handleDelete = async () => {
    if (selectedId && window.confirm("Czy na pewno chcesz usunąć tę książkę?")) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${selectedId}`);
        fetchBooks();
      } catch (error) {
        console.error("Błąd przy usuwaniu książki:", error);
      }
    }
  };

  return (
    <div className="book-page page">
      <div>
        <Link to="/home">
          <button className="return-button general-button">
            <Home size={18} style={{ marginRight: '0.5rem' }} />
            Powrót do strony głównej
          </button>
        </Link><br /><br />

        <h1>Lista książek</h1>

        <div>
          <table className="general-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Autor</th>
                <th>Tytuł</th>
                <th>Wydawnictwo</th>
                <th>Gatunek</th>
                <th>ISBN</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.book_id}
                  onClick={() => setSelectedId(book.book_id)}
                  style={{
                    backgroundColor:
                      book.book_id === selectedId ? "#d3d3d3" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{book.book_id}</td>
                  <td>{book.author}</td>
                  <td>{book.title}</td>
                  <td>{book.publisher}</td>
                  <td>{book.genre}</td>
                  <td>{book.isbn}</td>
                  <td>{book.status}</td>
                </tr>
              ))}
            </tbody>
          </table><br />

          <div>
            <button className="general-button" onClick={handleEdit} disabled={!selectedId}>
              <Edit2 size={18} style={{ marginRight: '0.5rem' }} />
              Edytuj
            </button>
            <button className="logout-button general-button" onClick={handleDelete} disabled={!selectedId}>
              <Trash2 size={18} style={{ marginRight: '0.5rem' }} />
              Usuń
            </button>
            <Link to="/books/add">
              <button className="general-button">
                <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
                Dodaj
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
