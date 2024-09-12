import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que estás importando jwtDecode

const AgregarCategoria = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }
      
      const decodedToken = jwtDecode(token);
      const usuarioId = decodedToken.idUsuarios; // Extrae el usuarioId del token

      // Datos a enviar
      const dataToSubmit = {
        nombre,
        estadoId: 4, // Valor predeterminado para estadoId
        usuarioId,
      };

      // Enviar datos al backend
      const response = await axios.post('http://localhost:4000/api/categoria/insertar', dataToSubmit, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      setSuccess('Categoría agregada correctamente');
      setError(null);
      setNombre(''); // Limpiar el campo de entrada
      setTimeout(() => navigate('/dashboard'), 2000); // Redirige al Dashboard después de 2 segundos

    } catch (err) {
      setError(err.message || 'Error al agregar la categoría.');
      setSuccess(null);
      console.error('Error en la solicitud:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Agregar Categoría
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField 
          label="Nombre de Categoría" 
          fullWidth 
          margin="normal" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <Box mt={2}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
          >
            Agregar
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleGoBack} 
            sx={{ ml: 2 }}>
            Regresar al Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AgregarCategoria;
