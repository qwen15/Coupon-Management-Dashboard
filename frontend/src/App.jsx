import { Routes, Route } from 'react-router-dom'
import MyLayout from './components/MyLayout'
import Dashboard from './pages/dashboard'
import AddCoupon from './pages/addCoupon'
import List from './pages/list'
import Redeem from './pages/redeemCoupon'

function App() {
  return (
    <MyLayout>
      <Routes>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/add' element={<AddCoupon />}/>
          <Route path='/redeem' element={<Redeem />}/>
          <Route path='/list' element={<List />}/>
      </Routes>
    </MyLayout>
  )
}

export default App
