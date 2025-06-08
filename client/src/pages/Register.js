import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, password });
      setMessage(res.data.message);
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="page">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nazwa użytkownika: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div><br />
        <button className='general-button' type="submit">Utwórz konto</button>
      </form>
      <p>{message}</p>
      <p>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
    </div>
  );
}

export default Register;