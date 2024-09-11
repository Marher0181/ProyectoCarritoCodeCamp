import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Products from './components/Products';
import Carrito from './components/Cart'; 
import Navbar from './components/NavBar'; 
import Checkout from './components/Checkout';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <Router>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/products" 
            element={<Products />} 
          />
          <Route 
            path="/carrito" 
            element={<Carrito />} 
          />
          <Route path="/checkout" element={<Checkout />} /> 
        </Routes>
      </CartProvider>
    </Router>
  );
};

export default App;
