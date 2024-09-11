import { useState } from 'react';
import { useCart } from '../context/CartContext'; // Ajusta la ruta según sea necesario
import axios from 'axios';

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!cart || cart.length === 0) {
    return <div>El carrito está vacío</div>;
  }

  // Obtener el usuariosId del token
  const getUsuariosIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    // Aquí deberías decodificar el token para extraer el usuariosId
    // Por simplicidad, asumimos que el token está en formato JSON
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return decodedToken?.usuariosId;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    const usuariosId = getUsuariosIdFromToken();

    if (!usuariosId) {
      setError('No se pudo obtener el ID del usuario');
      setLoading(false);
      return;
    }

    // Fecha de entrega: dentro de una semana
    const today = new Date();
    const deliveryDate = new Date(today.setDate(today.getDate() + 7));
    const formattedDate = deliveryDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Construir el JSON
    const orderData = {
      usuariosId,
      estadoId: 1, // Asigna el estado apropiado
      nombreCompleto,
      direccion,
      telefono,
      correoElectronico,
      fechaEntrega: formattedDate,
      totalOrden: getCartTotal(),
      detalles: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    try {
      const response = await axios.post('http://localhost:4000/api/ordenes', orderData);
      alert('Orden creada correctamente');
      console.log(response.data);
    } catch (error) {
      setError('Error al crear la orden');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Resumen del Pedido</h1>
      {cart.map((item) => (
        <div key={item.id}>
          <p>Producto: {item.nombre}</p>
          <p>Cantidad: {item.cantidad}</p>
          <p>Precio: {item.precio}</p>
        </div>
      ))}
      <h2>Total: ${getCartTotal()}</h2>
      
      <h2>Detalles del Envío</h2>
      <label>
        Nombre Completo:
        <input
          type="text"
          value={nombreCompleto}
          onChange={(e) => setNombreCompleto(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Dirección:
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Teléfono:
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Correo Electrónico:
        <input
          type="email"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
          required
        />
      </label>
      <br />
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Checkout;
