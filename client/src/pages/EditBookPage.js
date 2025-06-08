import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save, } from 'lucide-react';
import "../style/App.css";

function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        const book = res.data;
        setTitle(book.title);
        setPublisher(book.publisher);
        setIsbn(book.isbn);
        setSelectedAuthor(book.author_id);
        setSelectedGenre(book.genre_id);
      })
      .catch(err => console.error('Błąd przy pobieraniu danych książki:', err));

    axios.get('http://localhost:5000/api/authors')
      .then(res => setAuthors(res.data));
    axios.get('http://localhost:5000/api/genres')
      .then(res => setGenres(res.data));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, {
        title,
        publisher,
        isbn,
        author_id: selectedAuthor,
        genre_id: selectedGenre
      });
      navigate('/books');
    } catch (error) {
      console.error('Błąd przy aktualizacji książki:', error);
    }
  };

  return (
    <div className="add-book-page page">
      <h2>Edytuj książkę</h2>
      <form onSubmit={handleSubmit}>
        <text>Tytuł:</text>
        <input type="text" placeholder="Tytuł" value={title} onChange={e => setTitle(e.target.value)} required /><br />
        <text>Wydawnictwo:</text>
        <input type="text" placeholder="Wydawnictwo" value={publisher} onChange={e => setPublisher(e.target.value)} required /><br />
        <text>ISBN:</text>
        <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required /><br />
        <text>Autor:</text>
        <select value={selectedAuthor} onChange={e => setSelectedAuthor(e.target.value)} required><br />
          <option value="">Wybierz autora</option>
          {authors.map(author => (
            <option key={author.author_id} value={author.author_id}>
              {author.first_name} {author.last_name}
            </option>
          ))}
        </select><br />

        <text>Gatunek:</text>
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} required>
          <option value="">Wybierz gatunek</option>
          {genres.map(genre => (
            <option key={genre.genre_id} value={genre.genre_id}>
              {genre.name}
            </option>
          ))}
        </select><br />

        <button className="general-button" type="submit">
          <Save size={18} style={{ marginRight: '0.5rem' }} />
          Zapisz zmiany
        </button>
        <Link to="/books"><button className="return-button general-button" type="button">Anuluj</button></Link>
      </form>
    </div>
  );
}

export default EditBookPage;
