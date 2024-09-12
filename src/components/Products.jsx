import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField, CardMedia } from '@mui/material';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Asegúrate de importar useCart

function Products() {
  const { agregarAlCarrito } = useCart(); // Usa el hook para acceder a agregarAlCarrito
  const [productosList, setProductosList] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [error, setError] = useState(null); // Añadido para manejar errores

  useEffect(() => {
    obtener();
  }, []);

  const obtener = async () => {
    try {
      const token = localStorage.getItem('token'); // Asegúrate de que la clave coincida con la que usas para almacenar el token

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.get("http://localhost:4000/api/productos/obtener", config);
      console.log(response.data);
      setProductosList(response.data.result);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      setError('No se pudo obtener los productos.'); // Manejo de errores
    }
  };

  const handleCantidadChange = (id, cantidad) => {
    const producto = productosList.find(p => p.idProductos === id);
    setCantidades(prev => ({ 
      ...prev, 
      [id]: Math.min(Math.max(cantidad, 1), producto?.stock || 1) 
    }));
  };

  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.idProductos] || 1; 
    if (cantidad > 0 && producto.stock > 0) {
      agregarAlCarrito({ ...producto, cantidad });
      setCantidades(prev => ({ ...prev, [producto.idProducto]: 1 }));
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Lista de Productos</Typography>
      {error && <Typography color="error">{error}</Typography>} {/* Mostrar mensaje de error */}
      <Grid container spacing={4}>
        {productosList.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
            <Card sx={{ minWidth: 275, maxWidth: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:4000/api/productos/imagen/${producto.idProductos}`} // Verifica la URL
                alt={producto.nombre}
                onError={(e) => e.target.src = '../Default/ImagenPredeterminada.png'} // Imagen por defecto si falla
              />
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
                <Typography variant="body1" color="text.primary">
                  Stock: {producto.stock}
                </Typography>
                <TextField 
                  type="number" 
                  value={cantidades[producto.idProductos] || 1} 
                  onChange={(e) => handleCantidadChange(producto.idProductos, Number(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: producto.stock } }} 
                  label="Cantidad"
                />
              </CardContent>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleAgregar(producto)} 
                sx={{ m: 1 }}
                disabled={producto.stock <= 0} // Deshabilita el botón si el stock es 0
              >
                {producto.stock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Products;
