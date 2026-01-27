import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PurchaseOrders from './pages/PurchaseOrders';
import SalesOrders from './pages/SalesOrders';
import Invoices from './pages/Invoices';
import Queries from './pages/Queries';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />

          <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/po" element={<PurchaseOrders />} />
            <Route path="/so" element={<SalesOrders user={user} />} />
            <Route path="/invoices" element={<Invoices user={user} />} />
            <Route path="/queries" element={<Queries user={user} />} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
