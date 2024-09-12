import { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box, Paper, Modal, TextField, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:4000/api/productos';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/obtenerAdmin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(response.data.result || []);
      } catch (err) {
        setError('Error al obtener los productos.');
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/eliminar/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(products.filter(product => product.idProductos !== id));
      setSuccess('Producto eliminado correctamente.');
    } catch (err) {
      setError('Error al eliminar el producto.');
      console.error(err.response ? err.response.data : err.message);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setProduct({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handlevolver = () => {
    navigate('/dashboard');
  };

  const handleAdd = () => {
    navigate('/agregar-producto');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const usuarioId = decodedToken.idUsuarios;

      const formData = new FormData();
      formData.append('categoriaProductos', product.categoriaProductos);
      formData.append('nombre', product.nombre);
      formData.append('marca', product.marca);
      formData.append('codigo', product.codigo);
      formData.append('stock', product.stock);
      formData.append('estado', product.estado || '4');
      formData.append('precio', product.precio);
      formData.append('fecha_creacion', product.fecha_creacion);
      formData.append('usuarios', usuarioId);

      if (product.foto) {
        formData.append('foto', product.foto);
      }

      if (product.idProductos) {
        // Actualizar producto existente
        await axios.put(`${API_URL}/modificar/${product.idProductos}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Producto actualizado correctamente.');
      } else {
        // Añadir nuevo producto
        await axios.post(`${API_URL}/insertar`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setSuccess('Producto agregado correctamente.');
      }

      handleModalClose();
      setError(null);
      setProducts(prevProducts => prevProducts.map(p => p.idProductos === product.idProductos ? product : p));
      setTimeout(() => navigate('/crudProductos'), 2000); // Redirige después de 2 segundos
    } catch (err) {
      setError('Error al guardar el producto.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h4" gutterBottom>Gestión de Productos</Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAdd}
        sx={{ mb: 2 }}
        style={{ marginRight: 10 }}
      >
        Añadir Categoría
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handlevolver}
        sx={{ mb: 2 }}
      >
        Regresar al Dahboard
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.idProductos}>
                <TableCell>{product.idProductos}</TableCell>
                <TableCell>{product.nombre}</TableCell>
                <TableCell>{product.marca}</TableCell>
                <TableCell>${product.precio}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleEdit(product)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={() => handleDelete(product.idProductos)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para editar o añadir producto */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          borderRadius: 1, 
          boxShadow: 24, 
          p: 4 
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {product.idProductos ? 'Editar Producto' : 'Añadir Producto'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate mt={2}>
            <TextField
              label="Nombre"
              name="nombre"
              value={product.nombre || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Marca"
              name="marca"
              value={product.marca || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Precio"
              name="precio"
              value={product.precio || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fecha de Creación"
              name="fecha_creacion"
              value={product.fecha_creacion || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <input
              type="file"
              name="foto"
              onChange={(e) => setProduct({ ...product, foto: e.target.files[0] })}
              accept=".png"
            />
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {product.idProductos ? 'Actualizar Producto' : 'Añadir Producto'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProductManagement;
