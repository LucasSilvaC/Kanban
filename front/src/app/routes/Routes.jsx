import './styles/index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "../protected/protectedRoute";

function Routes() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Redefinir_senha />} />
        <Route path="/register" element={<Redefinir_senha />} />

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Redefinir_senha />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App