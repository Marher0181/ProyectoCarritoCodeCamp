import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Container, Typography, TextField, Button, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define el esquema de validación con yup
const schema = yup.object({
  correoElectronico: yup.string().email('Correo electrónico inválido').required('Correo electrónico es requerido'),
  nombreCompleto: yup.string().required('Nombre completo es requerido'),
  password: yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es requerido'),
  telefono: yup.string().matches(/^[0-9]+$/, 'Teléfono inválido').required('Teléfono es requerido'),
  fechaNacimiento: yup.date().required('Fecha de nacimiento es requerida')
}).required();

const Register = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rolId: 5, // Este campo no se mostrará en el formulario
      estadosId: 5 // Este campo no se mostrará en el formulario
    }
  });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const dataWithDefaults = {
      ...data,
      rolId: 5,
      estadosId: 5
    };

    try {
    console.log(dataWithDefaults);
      const response = await axios.post('http://localhost:4000/api/usuarios/register', dataWithDefaults);
      console.log('Respuesta del servidor:', response.data);
      navigate('/')
      

    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Registrarse
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
                error={!!errors.correoElectronico}
                helperText={errors.correoElectronico ? errors.correoElectronico.message : ''}
              />
            )}
          />
          <Controller
            name="nombreCompleto"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Nombre Completo"
                error={!!errors.nombreCompleto}
                helperText={errors.nombreCompleto ? errors.nombreCompleto.message : ''}
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
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ''}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
              />
            )}
          />
          <Controller
            name="telefono"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Teléfono"
                error={!!errors.telefono}
                helperText={errors.telefono ? errors.telefono.message : ''}
              />
            )}
          />
          <Controller
            name="fechaNacimiento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento ? errors.fechaNacimiento.message : ''}
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
            Registrarse
          </Button>
        </Box>
      </Paper>
      
<style></style>
    </Container>
  );
};

export default Register;
