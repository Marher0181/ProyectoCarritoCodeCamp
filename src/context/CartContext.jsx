import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Añadir un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCart((prevCart) => {
        // Si el producto no existe, agrégalo al carrito
        return [...prevCart, producto];
      
    });
  };

  // Eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCart((prevCart) => prevCart.filter(producto => producto.idProductos !== id));
  };

  // Vaciar el carrito
  const vaciarCarrito = () => {
    setCart([]);
  };

  // Obtener el total del carrito
  const getCartTotal = () => {
    return cart.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  };

  return (
    <CartContext.Provider value={{ cart, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook para usar el contexto
export const useCart = () => useContext(CartContext);
