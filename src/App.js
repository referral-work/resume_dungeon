import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Demo from './pages/Demo';
import ValidateComp from './components/ValidateComp';

function App() {
   return (
    <Routes>
      <Route path='' element={<Navigate to="/login" />} /> 
      <Route path='/login' element={<Login />} />
      <Route path='/validate' element={<ValidateComp />} />
      <Route path='/home' element={<Demo/>}/>
    </Routes>
  )
}

export default App;
