import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AgregarCategoria = () => {
  const [nombre, setNombre] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos al backend
    console.log({ nombre });
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Agregar Categoría</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Nombre de Categoría" 
          fullWidth 
          margin="normal" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">Agregar</Button>
        </Box>
      </form>
    </Container>
  );
};

export default AgregarCategoria;
