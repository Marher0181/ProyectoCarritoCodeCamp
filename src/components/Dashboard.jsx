import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CategoryIcon from '@mui/icons-material/Category';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado.');
        }

        const response = await axios.get('http://localhost:4000/api/orden/obtener', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

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
      <Box mb={4}>
        <Typography variant="h4" gutterBottom align="center">
          Dashboard
        </Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleIcon />}
            component={Link}
            to="/crudProductos"
          >
            Productos
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CategoryIcon />}
            component={Link}
            to="/crudCategorias"
          >
            Categorías
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom>
              Órdenes
            </Typography>
            <Box>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : ordenes.length === 0 ? (
                <Typography variant="body1" align="center" mt={4}>
                  No hay órdenes para mostrar.
                </Typography>
              ) : (
                ordenes.map(order => (
                  <Paper key={order.idOrden} elevation={2} sx={{ padding: 2, mb: 2 }}>
                    <Typography variant="body1"><strong>Orden ID:</strong> {order.idOrden}</Typography>
                    <Typography variant="body1"><strong>Cliente:</strong> {order.nombreCompleto}</Typography>
                    <Typography variant="body1"><strong>Estado:</strong> {order.nombre}</Typography>
                    <Typography variant="body1"><strong>Total:</strong> ${order.totalOrden !== undefined ? order.totalOrden.toFixed(2) : 'N/A'}</Typography>
                    <Box mt={2}>
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`/orden/${order.idOrden}`}
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
    </Container>
  );
};

export default Dashboard;
