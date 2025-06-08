import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BooksPage from './pages/BooksPage';
import UsersPage from './pages/UsersPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import AddUserPage from './pages/AddUserPage';
import EditUsersPage from './pages/EditUsersPage';
import LoanPage from './pages/LoanPage';
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  {/* Domyślna strona to logowanie */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/add" element={<AddBookPage />} />
        <Route path="/books/edit/:id" element={<EditBookPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/add" element={<AddUserPage />} />
        <Route path="/users/edit/:id" element={<EditUsersPage />} />
        <Route path="/loans" element={<LoanPage />} />
        <Route path="/stats" element={<StatsPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;


//Główny komponent aplikacji React, będący punktem centralnym logiki interfejsu użytkownika.

//Co się dzieje:
//Importuje React, hook useState oraz Axios (do wykonywania zapytań HTTP).
//Definiuje stan books, który przechowuje listę książek pobranych z backendu.
//Funkcja fetchBooks – wywoływana przy kliknięciu przycisku "Wyświetl książki". Wykonuje zapytanie do API (http://localhost:5000/api/books) i aktualizuje stan.
//Renderuje interfejs użytkownika: tytuł, przycisk do pobrania książek oraz komponent BookList, który wyświetla otrzymane dane.


// Cel:
// Główny komponent aplikacji front-end (React), który definiuje trasowanie (routing) oraz określa, którą stronę renderować w zależności od adresu URL.

// Szczegółowy przebieg działania:

// Importy:
// Importujesz elementy z react-router-dom (BrowserRouter, Routes, Route) oraz komponenty stron: Login, Register, Home.

// Konfiguracja Routera:
// Wewnątrz komponentu App otaczasz całą aplikację routerem (Router). Następnie definiujesz zestaw tras (Routes):

// Domyślna strona (path="/") – wyświetla logowanie.
// Strona /login – komponent Login.
// Strona /register – komponent Register.
// Strona /home – strona, na którą przekierowuje się po zalogowaniu (Home).

// Przekazywanie elementów:
// Każdy Route wskazuje, który komponent ma być wyrenderowany w danej ścieżce, dzięki czemu użytkownik po zmianie adresu widzi odpowiednią stronę.