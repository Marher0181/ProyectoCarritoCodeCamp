import { createContext, useContext, useState } from 'react';

// Crea el contexto
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para agregar un producto al carrito
  const agregarAlCarrito = (producto) => {
    setCart(prevCart => [...prevCart, producto]);
  };

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Función para obtener el total del carrito
  const getCartTotal = () => {
    return cart.reduce((sum, producto) => sum + producto.precio, 0);
  };

  return (
    <CartContext.Provider value={{ cart, agregarAlCarrito, eliminarDelCarrito, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto
export const useCart = () => {
  return useContext(CartContext);
};
