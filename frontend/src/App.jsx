import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authentication from './Authentication'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
