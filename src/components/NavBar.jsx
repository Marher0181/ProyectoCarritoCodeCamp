import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Container>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            E-Commerce
          </Typography>
          <Button variant="contained" color="inherit" onClick={() => navigate('/products')}>
            Productos
          </Button>
          <Button color="inherit" onClick={() => navigate('/carrito')}>
            Carrito
          </Button>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
