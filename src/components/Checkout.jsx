import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { Container, Paper, Typography, Box, TextField, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const Checkout = () => {
  const { cart, vaciarCarrito, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const usuariosId = decodedToken.idUsuarios; 

    const jsonData = {
      usuariosId,
      estadoId: 4,
      ...data,
      fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      totalOrden: getCartTotal(),
      detalles: cart.map(item => ({
        productoId: item.idProductos,
        cantidad: item.cantidad || 1,
        precio: item.precio
      }))
    };

    try {
      const response = await axios.post('http://localhost:4000/api/ordenDetalle/ordenes', jsonData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      vaciarCarrito();
      navigate('/products'); // Redirige a la página de inicio o a donde quieras después de completar el checkout
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Checkout
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="nombreCompleto"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Nombre Completo"
                error={!!errors.nombreCompleto}
                helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
              />
            )}
          />
          <Controller
            name="direccion"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Dirección"
                error={!!errors.direccion}
                helperText={errors.direccion ? errors.direccion.message : ''}
              />
            )}
          />
          <Controller
            name="telefono"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Teléfono"
                error={!!errors.telefono}
                helperText={errors.telefono ? errors.telefono.message : ''}
              />
            )}
          />
          <Controller
            name="correoElectronico"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Correo Electrónico"
                type="email"
                autoComplete="email"
                error={!!errors.correoElectronico}
                helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Finalizar Compra
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
