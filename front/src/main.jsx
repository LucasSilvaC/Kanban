import { createRoot } from 'react-dom/client'
import './styles/index.css'
import AppRoutes from './app/routes/Routes'

createRoot(document.getElementById('root')).render(
  <AppRoutes />
)