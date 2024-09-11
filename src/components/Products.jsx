import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Asegúrate de importar useCart

function Products() {
  const { agregarAlCarrito } = useCart(); // Usa el hook para acceder a agregarAlCarrito
  const [productosList, setProductosList] = useState([]);
  const [cantidades, setCantidades] = useState({});

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
      setProductosList(response.data.result[0]);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  const handleCantidadChange = (id, cantidad) => {
    // Asegúrate de que la cantidad sea siempre positiva y dentro del rango del stock
    setCantidades(prev => ({ 
      ...prev, 
      [id]: Math.min(Math.max(cantidad, 1), productosList.find(p => p.id === id)?.stock || 1) 
    }));
  };

  const handleAgregar = (producto) => {
    const cantidad = cantidades[producto.id] || 1; // Usa la cantidad especificada o 1 si no se ha especificado
    // Asegúrate de que `cantidad` sea un número positivo
    if (cantidad > 0) {
      agregarAlCarrito({ ...producto, cantidad });
      console.log(producto);
      // Opcional: Restablece la cantidad del producto en el estado después de agregar al carrito
      setCantidades(prev => ({ ...prev, [producto.id]: 1 }));
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Lista de Productos</Typography>
      <Grid container spacing={4}>
        {productosList.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.idProducto}>
            <Card sx={{ minWidth: 275, maxWidth: '100%' }}>
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
                  value={cantidades[producto.id] || 1} 
                  onChange={(e) => handleCantidadChange(producto.id, Number(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: producto.stock } }} 
                  label="Cantidad"
                />
              </CardContent>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => handleAgregar(producto)} 
                sx={{ m: 1 }}>
                Añadir al Carrito
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Products;
