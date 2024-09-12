// src/components/FormularioOrden.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { TextField, Button, Container, Grid, Typography } from '@mui/material';

const FormularioOrden = () => {
  const { cart, getCartTotal } = useCart();
  const [formData, setFormData] = useState({
    usuariosId: '',
    estadoId: '',
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    fechaEntrega: '',
    totalOrden: getCartTotal(),
    detalles: cart.map(item => ({
      productoId: item.id,
      cantidad: item.cantidad,
      precio: item.precio
    }))
  });

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      totalOrden: getCartTotal(),
      detalles: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    }));
  }, [cart, getCartTotal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/ordenes', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      alert('Orden enviada correctamente');
    } catch (error) {
      console.error('Error al enviar la orden:', error);
      alert('Error al enviar la orden');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Formulario de Orden
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID Usuario"
              name="usuariosId"
              value={formData.usuariosId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID Estado"
              name="estadoId"
              value={formData.estadoId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre Completo"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Correo Electrónico"
              name="correoElectronico"
              value={formData.correoElectronico}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha de Entrega"
              name="fechaEntrega"
              type="date"
              value={formData.fechaEntrega}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Total Orden"
              name="totalOrden"
              type="number"
              value={formData.totalOrden}
              onChange={handleChange}
              fullWidth
              required
              disabled
            />
          </Grid>
          {/* Aquí se podrían añadir los detalles si es necesario, pero ya se incluyen en el estado */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Enviar Orden
            </Button>
          </Grid>
        </Grid>
      </form>
      
<style></style>
    </Container>
  );
};

export default FormularioOrden;
