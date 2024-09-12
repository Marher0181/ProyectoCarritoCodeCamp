import { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Box, Paper, TextField, Modal, IconButton, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';

const API_URL = 'http://localhost:4000/api/categoria';

const CrudCategories = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/obtener`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(response.data.categories || []);
    } catch (err) {
      setError('Error al obtener las categorías.');
      console.error(err);
    }
  };

  const handleAdd = () => {
    navigate('/agregar-categoria');
  };

  const handlevolver = () => {
    navigate('/dashboard');
  };

  const handleEdit = (category) => {
    setCategory(category);
    setIsEditing(true);
    setOpenModal(true);
  };

  const handleDelete = async (idCategoria) => {
    try {
      await axios.put(`${API_URL}/eliminar/${idCategoria}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Categoría eliminada correctamente.');
      fetchCategories(); // Refresh categories after deletion
    } catch (err) {
      setError('Error al eliminar la categoría.');
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const usuarioId = decodedToken.idUsuarios;

      const data = {
        usuarioId,
        nombre: category.nombre,
        estadoId: category.estadoId || 4
      };

      if (isEditing) {
        await axios.put(`${API_URL}/modificar/${category.idCategoria}`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Categoría modificada correctamente.');
      } else {
        await axios.post(`${API_URL}/insertar`, data, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setSuccess('Categoría agregada correctamente.');
      }

      fetchCategories(); // Refresh categories after add/update
      handleModalClose();
      setError(null);
    } catch (err) {
      setError('Error al guardar la categoría.');
      console.error(err);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h4" gutterBottom>Gestión de Categorías</Typography>
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
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.idCategoria}>
                <TableCell>{cat.idCategoria}</TableCell>
                <TableCell>{cat.nombre}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(cat)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(cat.idCategoria)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            {isEditing ? 'Modificar Categoría' : 'Agregar Categoría'}
          </Typography>
          <IconButton
            onClick={handleModalClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Nombre"
              name="nombre"
              value={category.nombre || ''}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {isEditing ? 'Actualizar Categoría' : 'Añadir Categoría'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default CrudCategories;
