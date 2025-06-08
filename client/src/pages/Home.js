import React from 'react';
import { Link } from 'react-router-dom';
import '../style/App.css';
import { BookOpen, Users, ClipboardList, BarChart2, LogOut } from 'lucide-react';

function Home() {
  return (
    <div className="page home">
      <h1>System zarządzania biblioteką</h1>
      <h2>Witamy w panelu administratora. <br />Proszę wybrać akcję:</h2>
      <nav>
        <Link to="/books">
          <button className="general-button">
            <BookOpen size={18} style={{ marginRight: '0.5rem' }} />
            Zarządzaj książkami
          </button>
        </Link>
        <Link to="/users">
          <button className="general-button">
            <Users size={18} style={{ marginRight: '0.5rem' }} />
            Zarządzaj użytkownikami
          </button>
        </Link>
        <Link to="/loans">
          <button className="general-button">
            <ClipboardList size={18} style={{ marginRight: '0.5rem' }} />
            Wypożyczenia
          </button>
        </Link>
        <Link to="/stats">
          <button className="general-button">
            <BarChart2 size={18} style={{ marginRight: '0.5rem' }} />
            Raporty i statystyki
          </button>
        </Link>
        <Link to="/login">
          <button className="logout-button general-button">
            <LogOut size={18} style={{ marginRight: '0.5rem' }} />
            Wyloguj
          </button>
        </Link>
      </nav>
    </div>
  );
}

export default Home;