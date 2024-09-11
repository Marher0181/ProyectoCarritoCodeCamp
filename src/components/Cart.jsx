import { Grid, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { RemoveShoppingCart } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Importa el hook del contexto

const Carrito = () => {
  const { cart, eliminarDelCarrito, getCartTotal } = useCart(); // Usa el hook para acceder al carrito
  const navigate = useNavigate();

  const total = getCartTotal(); // Usa la función del contexto para obtener el total

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>
      <Grid container spacing={4}>
        {cart.length === 0 ? (
          <Typography variant="h6">El carrito está vacío</Typography>
        ) : (
          cart.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {producto.nombre}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Marca: {producto.marca}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Precio: ${producto.precio}
                  </Typography>
                </CardContent>
                <IconButton onClick={() => eliminarDelCarrito(producto.id)} color="error">
                  <RemoveShoppingCart />
                </IconButton>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {cart.length > 0 && (
        <div>
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Total: ${total}
          </Typography>
          <Button variant="contained" color="primary" style={{ marginTop: '10px' }} onClick={() => navigate('/checkout')}>
           Ir al Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Carrito;
