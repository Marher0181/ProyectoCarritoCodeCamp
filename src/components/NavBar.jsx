import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token){
    return null;
  }
  const decodedToken = jwtDecode(token);

  const handlelogout = () => {
    localStorage.removeItem('token')
    navigate('/');
  };

  if (decodedToken.rolId === 4){
    return( null );
  }
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
          <Button 
                variant="contained" 
                color="secondary" 
                style={{ marginLeft: 10 }} 
                onClick={handlelogout}
              >
                Logout
            </Button>
        </Container>
      </Toolbar>
      
    </AppBar>
  );
};

export default Navbar;
