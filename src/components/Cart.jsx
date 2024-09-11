import { Grid, Card, CardContent, Typography, IconButton, Button } from '@mui/material';
import { RemoveShoppingCart, DeleteForever } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Carrito = () => {
  const { cart, eliminarDelCarrito, vaciarCarrito, getCartTotal } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal();
  console.log(cart)

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Carrito de Compras</Typography>
      <Grid container spacing={4}>
        {cart.length === 0 ? (
          <Typography variant="h6">El carrito está vacío</Typography>
        ) : (
          cart.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.idProductos}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {producto.nombre}, {producto.idProductos}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Marca: {producto.marca}
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    Precio: ${producto.precio}, Cantidad: {producto.cantidad}
                  </Typography>
                </CardContent>
                <IconButton onClick={() => eliminarDelCarrito(producto.idProductos)} color="error">
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
          <Button 
            variant="outlined" 
            color="error" 
            style={{ marginTop: '10px', marginLeft: '10px' }} 
            onClick={() => vaciarCarrito()}
          >
            Vaciar Carrito
            <DeleteForever style={{ marginLeft: '8px' }} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Carrito;
