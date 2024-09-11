import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';

function Products({ agregarAlCarrito }) {
  const [productosList, setProductosList] = useState([]);

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

  return (
    <div>
      <Typography variant="h4" gutterBottom>Lista de Productos</Typography>
      <Grid container spacing={4}>
        {productosList.map((producto) => (
          <Grid item xs={12} sm={6} md={4} key={producto.id}>
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
              </CardContent>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => agregarAlCarrito(producto)} 
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

Products.propTypes = {
  agregarAlCarrito: PropTypes.func.isRequired,
};

export default Products;
