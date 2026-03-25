import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './UserProfile.css';

const UserProfile = () => {
  const { registro } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
  });
  const [saveError, setSaveError] = useState('');

  // Get current logged-in user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await userService.getUserByRegistro(registro);
        setProfileData(data);
        setFormData({
          nombres: data.nombres,
          apellidos: data.apellidos,
          email: data.email,
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Usuario no encontrado');
        } else {
          setError('Error al cargar el perfil del usuario');
        }
      } finally {
        setLoading(false);
      }
    };

    if (registro) {
      fetchProfile();
    }
  }, [registro]);

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle save
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaveError('');
      const updatedUser = await userService.updateUser(profileData.id, formData);
      setProfileData(updatedUser);
      setIsEditing(false);
      
      // If updating our own profile, update localStorage and reload to update Navbar
      if (currentUser && currentUser.id === updatedUser.id) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...updatedUser
        }));
        window.location.reload(); 
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setSaveError(err.response.data.message);
      } else {
        setSaveError('Error al actualizar el perfil');
      }
    }
  };

  if (loading) return <div className="profile-container loading">Cargando perfil...</div>;

  if (error) {
    return (
      <div className="profile-container error-container">
        <h2>{error}</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  if (!profileData) return null;

  const isOwnProfile = currentUser && currentUser.id === profileData.id;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Perfil de Usuario</h2>
          {isOwnProfile && !isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Editar perfil
            </button>
          )}
        </div>

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSave}>
            {saveError && <div className="error-message">{saveError}</div>}
            
            <div className="form-group">
              <label>Registro Académico</label>
              <input type="text" value={profileData.registro_academico} disabled className="disabled-input" />
              <small>El registro académico no se puede modificar.</small>
            </div>

            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="apellidos">Apellidos</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => {
                setIsEditing(false);
                setSaveError('');
                setFormData({
                  nombres: profileData.nombres,
                  apellidos: profileData.apellidos,
                  email: profileData.email,
                });
              }}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-group">
              <span className="info-label">Registro Académico:</span>
              <span className="info-value">{profileData.registro_academico}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Nombres:</span>
              <span className="info-value">{profileData.nombres}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Apellidos:</span>
              <span className="info-value">{profileData.apellidos}</span>
            </div>
            <div className="info-group">
              <span className="info-label">Correo Electrónico:</span>
              <span className="info-value">{profileData.email}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
