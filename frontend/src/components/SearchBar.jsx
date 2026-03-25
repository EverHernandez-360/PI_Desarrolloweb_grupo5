import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './SearchBar.css';

const SearchBar = () => {
  const [registro, setRegistro] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!registro.trim()) return;

    try {
      setError('');
      // Optionally we could just navigate, and let the profile page fetch and show 404
      // Here, following the requirement to check if it returns 200 before redirecting
      // but navigating to /profile/:registro directly and letting UserProfile show errors is more standard in React.
      // But the prompt says: "Si la respuesta es exitosa (200), redirigir a /profile/:registro... Si la respuesta es 404, mostrar un mensaje de error".
      await userService.getUserByRegistro(registro);
      navigate(`/profile/${registro}`);
      setRegistro(''); // clear search
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Usuario no encontrado');
      } else {
        setError('Error en la búsqueda');
      }
    }
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Buscar registro académico..."
          value={registro}
          onChange={(e) => setRegistro(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-search">
          Buscar perfil
        </button>
      </form>
      {error && <span className="search-error">{error}</span>}
    </div>
  );
};

export default SearchBar;
