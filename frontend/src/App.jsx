import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Authentication from './Authentication'
import Layout from './Layout'
import Home from './Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/authentication' element={<Authentication />} />
        <Route path='*' element={<Layout />}>
          <Route index element={<Home />} />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
