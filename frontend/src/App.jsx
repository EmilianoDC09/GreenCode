import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import Tutorial from './pages/Tutorial.jsx';
import Editor from './pages/Editor.jsx';

/** Mapa de rutas de la plataforma. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/editor" element={<Editor />} />
        {/* Cualquier ruta desconocida regresa al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
