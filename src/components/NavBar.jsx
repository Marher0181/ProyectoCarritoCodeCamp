import { AppBar, Toolbar, Typography, Button, Container, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { ShoppingCart, Storefront, ExitToApp } from '@mui/icons-material'; // Importa los iconos

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  const decodedToken = jwtDecode(token);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (decodedToken.rolId === 4) {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            E-Commerce
          </Typography>
          <div>
            <IconButton color="inherit" onClick={() => navigate('/products')}>
              <Storefront />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/carrito')}>
              <ShoppingCart />
            </IconButton>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ExitToApp />} // Icono para el botón de Logout
              style={{ marginLeft: 10 }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
