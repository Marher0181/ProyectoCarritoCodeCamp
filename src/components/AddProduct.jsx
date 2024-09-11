import { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AgregarProducto = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos al backend
    console.log({ nombre, precio });
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Agregar Producto</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Nombre" 
          fullWidth 
          margin="normal" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
        <TextField 
          label="Precio" 
          type="number" 
          fullWidth 
          margin="normal" 
          value={precio} 
          onChange={(e) => setPrecio(e.target.value)} 
          required 
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">Agregar</Button>
        </Box>
      </form>
    </Container>
  );
};

export default AgregarProducto;
