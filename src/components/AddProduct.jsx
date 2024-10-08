import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de que estás importando jwtDecode

const AddProduct = () => {
  const [formData, setFormData] = useState({
    categoriaProductos: '',
    nombre: '',
    marca: '',
    codigo: '',
    stock: '',
    estado: '4', // Valor predeterminado para el campo estado
    precio: '',
    fecha_creacion: '',
    foto: null // Cambia a null para archivos
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null); // Para almacenar el ID del usuario
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.idUsuarios); // Almacena el ID del usuario

          const response = await axios.get('http://localhost:4000/api/categoria/obtener', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          setCategories(response.data.categories || []);
        }
      } catch (err) {
        setError(err.message || 'Error al obtener categorías.');
        setCategories([]); // Resetea las categorías en caso de error
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'foto' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token && userId) {
        const dataToSubmit = new FormData();
        Object.keys(formData).forEach(key => {
          dataToSubmit.append(key, formData[key]);
        });
        dataToSubmit.append('usuarios', userId);

        const response = await axios.post('http://localhost:4000/api/productos/insertar', dataToSubmit, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response);
        setSuccess('Producto agregado correctamente');
        setError(null);
        setFormData({
          categoriaProductos: '',
          nombre: '',
          marca: '',
          codigo: '',
          stock: '',
          estado: '4',
          precio: '',
          fecha_creacion: '',
          foto: null
        });
        setTimeout(() => navigate('/crudProductos'), 2000); // Redirige después de 2 segundos
      }
    } catch (err) {
      setError(err.message || 'Error al agregar el producto.');
      setSuccess(null);
    }
  };

  const handleGoBack = () => {
    navigate('/crudProductos');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Typography variant="h4" gutterBottom>Agregar Producto</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth margin="normal">
          <InputLabel>Categoría de Productos</InputLabel>
          <Select
            name="categoriaProductos"
            value={formData.categoriaProductos || ''}
            onChange={handleChange}
            label="Categoría de Productos"
          >
            {categories.length > 0 ? (
              categories.map(category => (
                <MenuItem key={category.idCategoria} value={category.idCategoria}>
                  {category.nombre}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No hay categorías disponibles
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <TextField
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Código"
          name="codigo"
          value={formData.codigo}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Precio"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Fecha de Creación"
          name="fecha_creacion"
          value={formData.fecha_creacion}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          component="label"
          fullWidth
          margin="normal"
          color="primary"
        >
          Subir Foto
          <input
            type="file"
            name="foto"
            onChange={handleChange}
            accept=".png"
            hidden
          />
        </Button>
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Agregar Producto
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleGoBack} 
            sx={{ ml: 2 }}>
            Regresar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AddProduct;
