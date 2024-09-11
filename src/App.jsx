import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Carrito from './components/Cart'; 
import Navbar from './components/NavBar'; 
import Checkout from './components/Checkout';
import AgregarProducto from './components/AddProduct';
import AgregarCategoria from './components/AddCategory';
import Dashboard from './components/Dashboard'
import OrderDetails from './components/OrderDetails';
const App = () => {
  return (
    <Router>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} /> 
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/agregar-producto" element={<AgregarProducto />} />
          <Route path="/agregar-categoria" element={<AgregarCategoria />} />
          <Route path="/orden/:idOrden" element={<OrderDetails />} />
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
