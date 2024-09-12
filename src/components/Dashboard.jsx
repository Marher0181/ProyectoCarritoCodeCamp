import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Obtener el token y agregarlo a la solicitud
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado.');
        }

        const response = await axios.get('http://localhost:4000/api/orden/obtener', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response);
        // Extraer el arreglo de órdenes del resultado
        if (response.data && Array.isArray(response.data.result)) {
          setOrdenes(response.data.result[0]);
        } else {
          throw new Error('La respuesta de la API no contiene el campo "result" como un arreglo.');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar las órdenes.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Agregar</Typography>
            <Box mt={2}>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/agregar-producto"
              >
                Agregar Producto
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                style={{ marginLeft: 10 }} 
                component={Link} 
                to="/agregar-categoria"
              >
                Agregar Categoría
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Órdenes</Typography>
            <Box mt={2}>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : ordenes.length === 0 ? (
                <Typography variant="body1">No hay órdenes para mostrar.</Typography>
              ) : (
                ordenes.map(order => (
                  <Paper key={order.idOrden} style={{ padding: 10, marginBottom: 10 }}>
                    <Typography variant="body1">Orden ID: {order.idOrden}</Typography>
                    <Typography variant="body1">Cliente: {order.nombreCompleto}</Typography>
                    <Typography variant="body1">Estado: {order.nombre}</Typography>
                    <Typography variant="body1">Total: ${order.totalOrden !== undefined ? order.totalOrden.toFixed(2) : 'N/A'}</Typography>
                    <Box mt={2}>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        component={Link} 
                        to={`/orden/${order.idOrden}`} // Redirige a la página de detalles
                      >
                        Ver Detalles
                      </Button>
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
<style></style>
    </Container>
  );
};

export default Dashboard;
