import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Intro from './pages/Intro';
import Login from './pages/Login';
import CrmLayout from './layouts/CrmLayout';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Contatos from './pages/Contatos';
import Usuarios from './pages/Usuarios';
import FeedAtividades from './pages/FeedAtividades';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />

        {/* Protected CRM Routes */}
        <Route path="/app" element={<CrmLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="contatos" element={<Contatos />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="feed" element={<FeedAtividades />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
