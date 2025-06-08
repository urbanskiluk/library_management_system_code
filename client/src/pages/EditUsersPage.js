import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import "../style/App.css";

function EditUserPage() {
  const { id } = useParams();
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

  useEffect(() => {
    axios.get(`http://localhost:5000/api/users/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error('Błąd przy pobieraniu danych użytkownika:', err));
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${id}`, formData);
      navigate('/users');
    } catch (error) {
      console.error('Błąd przy aktualizacji użytkownika:', error);
    }
  };

  return (
    <div className="page">
      <h2>Edytuj użytkownika</h2>
      <form onSubmit={handleSubmit}>
        <text>Imię:</text>
        <input type="text" name="first_name" placeholder="Imię" value={formData.first_name} onChange={handleChange} required /><br />
        <text>Nazwisko:</text>
        <input type="text" name="last_name" placeholder="Nazwisko" value={formData.last_name} onChange={handleChange} required /><br />
        <text>E-mail:</text>
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required /><br />
        <text>Numer telefonu:</text>
        <input type="text" name="phone_number" placeholder="Telefon" value={formData.phone_number} onChange={handleChange} required /><br />
        <text>Ulica:</text>
        <input type="text" name="street" placeholder="Ulica" value={formData.street} onChange={handleChange} required /><br />
        <text>Numer domu:</text>
        <input type="text" name="house_number" placeholder="Nr domu/mieszkania" value={formData.house_number} onChange={handleChange} required /><br />
        <text>Kod pocztowy:</text>
        <input type="text" name="postal_code" placeholder="Kod pocztowy" value={formData.postal_code} onChange={handleChange} required /><br />
        <text>Miasto:</text>
        <input type="text" name="city" placeholder="Miasto" value={formData.city} onChange={handleChange} required /><br />
        <text>Kraj:</text>
        <input type="text" name="country" placeholder="Kraj" value={formData.country} onChange={handleChange} required /><br />

        <button className="general-button" type="submit">
          <Save size={18} style={{ marginRight: '0.5rem' }} />
          Zapisz zmiany
        </button>
        <Link to="/users"><button className="return-button general-button"type="button">Anuluj</button></Link>
      </form>
    </div>
  );
}

export default EditUserPage;
