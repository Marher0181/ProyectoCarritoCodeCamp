import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


const schema = yup.object({
  correoElectronico: yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida')
}).required();



const Login = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try{
      const response = await axios.post('http://localhost:4000/api/usuarios/login', data)
      localStorage.setItem('token', response.data.token)
      const token = localStorage.getItem('token');
      if (token) {
        console.log(token)
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);


        // Redireccionas según el rol
        if (decodedToken.rolId === 4) {
          //navigate('/admin-dashboard'); 
          console.log('Admin')
          
        } else if (decodedToken.rolId === 5) {
          //navigate('/user-dashboard'); 
          console.log('user')
          navigate('/products')
        } else {
          //navigate('/unauthorized');
          console.log('sopas')
        }
      } else {
        console.error('Login fallido');
      }
    }catch(err){
      console.error(err);
    }
    console.log('Submitted data:', data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <Controller
            name="correoElectronico"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Correo Electrónico"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar Sesión
          </Button>
          <Button
            fullWidth
            variant="text"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/register')}
          >
            Crear una cuenta
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
