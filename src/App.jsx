import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuPage from './pages/MenuPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

// Single-tenant app served under /driver-game-center (see BrowserRouter basename),
// so in-app paths are '/' (menu) and '/admin' relative to that base.
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
    </>
  );
}
