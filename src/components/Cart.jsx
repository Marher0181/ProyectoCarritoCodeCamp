import { Grid, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { RemoveShoppingCart } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Carrito = ({ carrito, eliminarDelCarrito }) => {
  const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
  const navigate = useNavigate();
  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>
      <Grid container spacing={4}>
        {carrito.length === 0 ? (
          <Typography variant="h6">El carrito está vacío</Typography>
        ) : (
          carrito.map((producto) => (
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

      {carrito.length > 0 && (
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

// Definir PropTypes para el componente
Carrito.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      marca: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired
    })
  ).isRequired,
  eliminarDelCarrito: PropTypes.func.isRequired,
};

export default Carrito;
