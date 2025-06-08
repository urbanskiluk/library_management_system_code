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
        <Route path="/" element={<Login />} />
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