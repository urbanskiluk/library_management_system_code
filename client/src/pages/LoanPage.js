import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Home, BookPlus, RotateCw } from 'lucide-react';
import "../style/App.css";


function LoanPage() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [message, setMessage] = useState('');

  const [userSearch, setUserSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [loanStatusFilter, setLoanStatusFilter] = useState('');
  const [loanSearch, setLoanSearch] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [uRes, bRes, lRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/loans/books/available'),
        axios.get('http://localhost:5000/api/loans'),
      ]);
      setUsers(uRes.data);
      setBooks(bRes.data);
      setLoans(lRes.data);
    } catch (err) {
      console.error(err);
      setMessage('Błąd podczas pobierania danych');
    }
  };

  const handleBorrow = async () => {
    if (!selectedUser || !selectedBook) {
      setMessage('Wybierz użytkownika i książkę');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/loans', { user_id: selectedUser, book_id: selectedBook });
      setMessage('Wypożyczenie utworzone');
      setSelectedBook(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage('Błąd przy tworzeniu wypożyczenia');
    }
  };

  const handleReturn = async () => {
    if (!selectedLoan) {
      setMessage('Zaznacz wypożyczenie do zwrotu');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/loans/${selectedLoan}/return`);
      setMessage('Wypożyczenie zwrócone');
      setSelectedLoan(null);
      await fetchAll();
    } catch (err) {
      console.error(err);
      setMessage('Błąd przy zwrocie wypożyczenia');
    }
  };

  const rowColor = (status) => {
    switch (status) {
      case 'aktywne': return '#d4edda';
      case 'aktywne po terminie': return '#fff3cd';
      case 'nieaktywne': return '#e2e3e5';
      default: return 'transparent';
    }
  };

  const filteredUsers = users.filter(u =>
    u.last_name.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(bookSearch.toLowerCase())
  );
  const filteredLoans = loans.filter(l => {
    let statusMatch = loanStatusFilter ? l.status === loanStatusFilter : true;
    let searchMatch = l.user_name.toLowerCase().includes(loanSearch.toLowerCase())
      || l.book_title.toLowerCase().includes(loanSearch.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="loan-page page">
      {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}

      <Link to="/home">
        <button className="return-button general-button" style={{ marginBottom: "4rem" }}>
          <Home size={18} style={{ marginRight: '0.5rem' }} />
          Powrót do strony głównej
        </button>
      </Link>

      <div className="user-book-selection-container">
        <div>
          <input
            type="text"
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            placeholder="Wyszukaj użytkownika po nazwisku"
          />
          <h3>Użytkownicy</h3>
          <table className="general-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imię</th>
                <th>Nazwisko</th>
                <th>Numer telefonu</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr
                  key={u.user_id}
                  onClick={() => setSelectedUser(u.user_id)}
                  style={{
                    backgroundColor: u.user_id === selectedUser ? '#def' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <td>{u.user_id}</td>
                  <td>{u.first_name}</td>
                  <td>{u.last_name}</td>
                  <td>{u.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <input
            type="text"
            value={bookSearch}
            onChange={e => setBookSearch(e.target.value)}
            placeholder="Wyszukaj książkę po tytule"
          />
          <h3>Dostępne książki</h3>
          <table className="general-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Autor</th>
                <th>Tytuł</th>
                <th>Gatunek</th>
                <th>ISBN</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(b => (
                <tr
                  key={b.book_id}
                  onClick={() => setSelectedBook(b.book_id)}
                  style={{
                    backgroundColor: b.book_id === selectedBook ? '#def' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <td>{b.book_id}</td>
                  <td>{b.author}</td>
                  <td>{b.title}</td>
                  <td>{b.genre}</td>
                  <td>{b.isbn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="general-button"
          onClick={handleBorrow}
          disabled={!selectedUser || !selectedBook}
          style={{ marginBottom: "4rem" }}
        >
          <BookPlus size={18} style={{ marginRight: '0.5rem' }} />
          Wypożycz
        </button>

      </div><hr />

      <div>
        <h1>Lista wypożyczeń</h1>
        <div>
          <label>Filtrowanie po statusie: </label>
          <select
            value={loanStatusFilter}
            onChange={e => setLoanStatusFilter(e.target.value)}
            style={{ marginBottom: "1rem" }}
          >
            <option value="">-- Wszystkie --</option>
            <option value="aktywne">aktywne</option>
            <option value="aktywne po terminie">aktywne po terminie</option>
            <option value="nieaktywne">nieaktywne</option>
          </select>
          <input
            type="text"
            value={loanSearch}
            onChange={e => setLoanSearch(e.target.value)}
            placeholder="Wyszukaj wypożyczenie po tytule lub użytkowniku"
            style={{ width: "22.5rem" }}
          />
        </div>

        <table className="general-table">
          <thead>
            <tr>
              <th>Wypożyczenie ID</th>
              <th>Użytkownik ID</th><th>Użytkownik</th>
              <th>Książka ID</th><th>Tytuł</th>
              <th>Data od</th><th>Data do</th>
              <th>Opóźnienie (dni)</th>
              <th>Kara [zł]</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map(l => (
              <tr
                key={l.loan_id}
                onClick={() => setSelectedLoan(l.loan_id)}
                style={{
                  backgroundColor: rowColor(l.status),
                  boxShadow: l.loan_id === selectedLoan ? 'inset 0 0 0 2px #007BFF' : 'none',
                  cursor: 'pointer'
                }}
              >
                <td>{l.loan_id}</td>
                <td>{l.user_id}</td><td>{l.user_name}</td>
                <td>{l.book_id}</td><td>{l.book_title}</td>
                <td>{l.loan_date}</td>
                <td>{l.return_date || '-'}</td>
                <td>{Number(l.overdue_days)}</td>
                <td>{Number(l.fine_amount).toFixed(2)}</td>
                <td>{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table><br />


        <button
          className='general-button'
          onClick={handleReturn}
          disabled={!selectedLoan || !['aktywne', 'aktywne po terminie'].includes(loans.find(l => l.loan_id === selectedLoan)?.status)}
        >
          <RotateCw size={18} style={{ marginRight: '0.5rem' }} />
          Zwróć wypożyczenie
        </button>

      </div>
    </div>

  );
}

export default LoanPage;
