import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Products() {
  const [productosList, setProductosList] = useState([]);

  useEffect(() => {
    obtener();
  }, []);
  const navigate = useNavigate();
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
    <Grid container spacing={8}>
      {productosList.map((val, key) => (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card sx={{ minWidth: 275, maxWidth: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {val.nombre}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {val.marca}
              </Typography>
              <Button  
                fullWidth
                variant="text"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => navigate('/register')}
              ></Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Products;
