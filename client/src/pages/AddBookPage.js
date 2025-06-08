import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

function AddBookPage() {
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [isbn, setIsbn] = useState('');

  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);

  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/authors')
      .then(res => {
        setAuthors(res.data);
        setFilteredAuthors(res.data);
      })
      .catch(err => console.error('Błąd pobierania autorów:', err));

    axios.get('http://localhost:5000/api/genres')
      .then(res => setGenres(res.data))
      .catch(err => console.error('Błąd pobierania gatunków:', err));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    const filtered = authors.filter((author) =>
      `${author.first_name} ${author.last_name}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAuthors(filtered);
    if (filtered.length === 0) {
      setSelectedAuthorId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setFormError('');


    const newErrors = {};
    if (!title) newErrors.title = 'Tytuł jest wymagany.';
    if (!publisher) newErrors.publisher = 'Wydawnictwo jest wymagane.';
    const isbnRegex = /^[0-9]{13}$/;
    if (!isbn) {
      newErrors.isbn = 'ISBN jest wymagany.';
    } else if (!isbnRegex.test(isbn)) {
      newErrors.isbn = 'ISBN musi składać się z 13 cyfr.';
    }
    if (!searchInput) newErrors.author = 'Wpisz autora.';
    if (!selectedGenre) newErrors.genre = 'Wybierz gatunek.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFormError('Nie można dodać książki. Wprowadź poprawne dane.');
      return;
    }

    let finalAuthorId = selectedAuthorId;
    if (!finalAuthorId) {
      const names = searchInput.trim().split(' ');
      const first_name = names[0];
      const last_name = names.slice(1).join(' ') || 'Unknown';
      try {
        const res = await axios.post('http://localhost:5000/api/authors', { first_name, last_name });
        finalAuthorId = res.data.author_id;
      } catch (error) {
        console.error('Błąd przy dodawaniu nowego autora:', error);
        setFormError('Błąd przy dodawaniu nowego autora.');
        return;
      }
    }

    try {
      await axios.post('http://localhost:5000/api/books', {
        title,
        publisher,
        isbn,
        author_id: finalAuthorId,
        genre_id: selectedGenre,
      });
      navigate('/books');
    } catch (error) {
      console.error('Błąd przy dodawaniu książki:', error);
      setFormError('Wystąpił błąd przy dodawaniu książki. Spróbuj ponownie.');
    }
  };

  return (
    <div className="add-book-page page">
      <h2>Dodaj nową książkę</h2>

      {formError && <p style={{ color: 'red', fontWeight: 'bold' }}>{formError}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <input
          type="text"
          placeholder="Tytuł"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}

        <input
          type="text"
          placeholder="Wydawnictwo"
          value={publisher}
          onChange={e => setPublisher(e.target.value)}
          required
        />
        {errors.publisher && <span style={{ color: 'red' }}>{errors.publisher}</span>}

        <input
          type="text"
          placeholder="ISBN"
          value={isbn}
          onChange={e => setIsbn(e.target.value)}
          required
        />
        {errors.isbn && <span style={{ color: 'red' }}>{errors.isbn}</span>}

        <div>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Wpisz nazwisko autora"
            autoComplete="off"
            required
          />
          {searchInput && filteredAuthors.length > 0 && (
            <ul className="drop-down-list">
              {filteredAuthors.map((author) => (
                <li
                  key={author.author_id}
                  onClick={() => {
                    setSearchInput(`${author.first_name} ${author.last_name}`);
                    setSelectedAuthorId(author.author_id);
                    setFilteredAuthors([]);
                  }}>

                  {author.first_name} {author.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.author && <span style={{ color: 'red' }}>{errors.author}</span>}

        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} required>
          <option value="">Wybierz gatunek</option>
          {genres.map(genre => (
            <option key={genre.genre_id} value={genre.genre_id}>
              {genre.name}
            </option>
          ))}
        </select>
        {errors.genre && <span style={{ color: 'red' }}>{errors.genre}</span>}

        <button className="general-button" type="submit">
          <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
          Dodaj książkę
        </button>
        <Link to="/books">
          <button className="return-button general-button" type="button">
            Anuluj
          </button>
        </Link>
      </form>
    </div>
  );
}

export default AddBookPage;