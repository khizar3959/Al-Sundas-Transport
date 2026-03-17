import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Operators from './pages/Operators';
import Vehicles from './pages/Vehicles';
import Rentals from './pages/Rentals';
import Customers from './pages/Customers';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Fuel from './pages/Fuel';
import Maintenance from './pages/Maintenance';
import Invoices from './pages/Invoices';
import Documents from './pages/Documents';
import Reports from './pages/Reports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="operators" element={<Operators />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="rentals" element={<Rentals />} />
              <Route path="customers" element={<Customers />} />
              <Route path="income" element={<Income />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="fuel" element={<Fuel />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="documents" element={<Documents />} />
              <Route path="reports" element={<Reports />} />
              <Route path="*" element={<div className="p-6"><h1>404 Not Found</h1></div>} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
