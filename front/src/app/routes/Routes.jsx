import '../../styles/index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeKanban from "../../pages/home/home"
import TableViews from '../../pages/tableViews/TableViews';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomeKanban />} />
        <Route path="/table-views" element={<TableViews/>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes