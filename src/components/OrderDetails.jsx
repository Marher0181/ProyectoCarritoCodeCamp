import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Button } from '@mui/material';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const { idOrden } = useParams();
  const navigate = useNavigate(); // Hook para redireccionamiento
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!idOrden) {
        setError('ID de orden no proporcionado.');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token no encontrado.');
        }

        const response = await axios.get(`http://localhost:4000/api/orden/orden/${idOrden}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Datos de la orden:', response.data); // Verifica la respuesta completa
        setOrderDetails(response.data.result[0]);
      } catch (err) {
        setError(err.message || 'Error al cargar los detalles de la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [idOrden]);

  const handleDeliverOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado.');
      }

      await axios.put(`http://localhost:4000/api/orden/entregar/${idOrden}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Redirige al dashboard después de actualizar el estado de la orden
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al entregar la orden.');
    }
  };

  const handlevolver = () => {
    navigate('/dashboard');
  };

  const handleRejectOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no encontrado.');
      }

      await axios.put(`http://localhost:4000/api/orden/rechazo/${idOrden}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setOrderDetails(orderDetails.map(detail => ({
        ...detail,
        estadoId: 11
      })));
      alert('Orden rechazada');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al rechazar la orden.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Detalles de la Orden</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : orderDetails.length === 0 ? (
        <Typography variant="body1">No se encontraron detalles para esta orden.</Typography>
      ) : (
        <>
          {orderDetails.map(detail => (
            <Paper key={detail.idOrdenDetalles} style={{ padding: 20, marginBottom: 10 }}>
              <Typography variant="h6">Detalle de Orden</Typography>
              <Box mt={2}>
                <Typography variant="body1">Orden ID: {detail.idOrden}</Typography>
                <Typography variant="body1">Producto: {detail.nombre}</Typography>
                <Typography variant="body1">Cantidad: {detail.cantidad}</Typography>
                <Typography variant="body1">Precio: ${detail.precio.toFixed(2)}</Typography>
                <Typography variant="body1">Subtotal: ${detail.subtotal.toFixed(2)}</Typography>
              </Box>
            </Paper>
          ))}
          <Box mt={2}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleDeliverOrder} 
              style={{ marginRight: 10 }}
            >
              Entregar
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleRejectOrder}
              style={{ marginRight: 10 }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handlevolver}
            >
              Volver al Dashboard
            </Button>
          </Box>
        </>
      )}
      
<style></style>
    </Container>
  );
};

export default OrderDetails;
