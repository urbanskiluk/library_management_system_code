import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, } from 'lucide-react';
import "../style/App.css";

function AddUserPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    street: '',
    house_number: '',
    postal_code: '',
    city: '',
    country: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postalCodeRegex = /^\d{2}-\d{3}$/;
    if (!postalCodeRegex.test(formData.postal_code)) {
      alert('Podaj poprawny kod pocztowy w formacie xx-xxx (np. 32-435)');
      return;
    }

    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      alert('Podaj poprawny numer telefonu składający się z 9 cyfr');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users', formData);
      navigate('/users');
    } catch (error) {
      console.error('Błąd przy dodawaniu użytkownika:', error);
    }
  };

  return (
    <div className="page">
      <h2>Dodaj nowego użytkownika</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="Imię" value={formData.first_name} onChange={handleChange} required /><br />
        <input type="text" name="last_name" placeholder="Nazwisko" value={formData.last_name} onChange={handleChange} required /><br />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required /><br />
        <input type="text" name="phone_number" placeholder="Telefon" value={formData.phone_number} onChange={handleChange} required /><br />
        <input type="text" name="street" placeholder="Ulica" value={formData.street} onChange={handleChange} required /><br />
        <input type="text" name="house_number" placeholder="Nr domu/mieszkania" value={formData.house_number} onChange={handleChange} required /><br />
        <input type="text" name="postal_code" placeholder="Kod pocztowy" value={formData.postal_code} onChange={handleChange} required /><br />
        <input type="text" name="city" placeholder="Miasto" value={formData.city} onChange={handleChange} required /><br />
        <input type="text" name="country" placeholder="Kraj" value={formData.country} onChange={handleChange} required /><br /><br />

        <button className='general-button' type="submit">
          <PlusCircle size={18} style={{ marginRight: '0.5rem' }} />
          Dodaj użytkownika
        </button>
        <Link to="/users">
          <button className='return-button general-button' type="button">
            Anuluj
          </button>
        </Link>
      </form>
    </div>
  );
}

export default AddUserPage;
