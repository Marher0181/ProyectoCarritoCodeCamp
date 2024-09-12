import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

// Define el esquema de validación
const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('El nombre de la categoría es obligatorio'),
});

const AgregarCategoria = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const handleGoBack = () => {
    navigate('/crudCategorias');
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación.');
      }
      
      const decodedToken = jwtDecode(token);
      const usuarioId = decodedToken.idUsuarios;

      const dataToSubmit = {
        nombre: data.nombre,
        estadoId: 4,
        usuarioId,
      };

      const response = await axios.post('http://localhost:4000/api/categoria/insertar', dataToSubmit, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response);
      setSuccess('Categoría agregada correctamente');
      setError(null);
      setTimeout(() => navigate('/crudCategorias'), 2000);

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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="nombre"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre de Categoría"
              fullWidth
              margin="normal"
              required
              error={!!errors.nombre}
              helperText={errors.nombre ? errors.nombre.message : ''}
            />
          )}
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
            sx={{ ml: 2 }}
          >
            Regresar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AgregarCategoria;
