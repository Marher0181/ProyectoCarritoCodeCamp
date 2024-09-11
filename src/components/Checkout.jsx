import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const usuariosId = decodedToken.idUsuarios; 
    console.log(usuariosId + 'ESTE ES EL TOKEN INGO');

    const jsonData = {
      usuariosId,
      estadoId: 4,
      nombreCompleto,
      direccion,
      telefono,
      correoElectronico,
      fechaEntrega: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      totalOrden: getCartTotal(),
      detalles: cart.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad || 1, 
        precio: item.precio
      }))
    };
    console.log(token)
    console.log(jsonData);
    try {
      const response = await axios.post('http://localhost:4000/api/ordenDetalle/ordenes', jsonData, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'), 
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      navigate('/'); // Redirige a la página de inicio o a donde quieras después de completar el checkout
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre Completo:
          <input type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required />
        </label>
        <label>
          Dirección:
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </label>
        <label>
          Teléfono:
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>
        <label>
          Correo Electrónico:
          <input type="email" value={correoElectronico} onChange={(e) => setCorreoElectronico(e.target.value)} required />
        </label>
        <button type="submit">Finalizar Compra</button>
      </form>
    </div>
  );
};

export default Checkout;
