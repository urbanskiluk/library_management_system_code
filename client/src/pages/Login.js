import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';
import '../style/App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      setMessage(res.data.message);
      navigate('/home');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="page">
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <div className='log-form'>
          <label>Nazwa użytkownika: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='log-form'>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='general-button' type="submit">
          <LogIn size={18} style={{ marginRight: '0.5rem' }} />
          Zaloguj się
        </button>
      </form>
      <p>{message}</p>
      <p>Nie masz konta? <Link to="/register">Załóż konto</Link></p>
    </div>
  );
}

export default Login;