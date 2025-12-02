import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'antd/dist/reset.css'
import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/login.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/admin/*' element={<App/>} />
      </Routes>
  </Router>
)
