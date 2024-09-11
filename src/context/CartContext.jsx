import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.precio * item.cantidad, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Validación de las props del proveedor
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export default CartContext;
