import React from 'react'
import Graficadora from './modules/editor/page/Graficadora.jsx'
import { PagesProyectos } from './modules/proyectos/pages/pages_proyectos.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="App" style={{ height: '100vh', width: '100%' ,backgroundColor: 'red'}}>

      
       <Routes>
        <Route path='/' element={<Graficadora/>}/>
        <Route path='/proyectos' element={<PagesProyectos/>}/>
        <Route path='/proyectos/board/:id_board' element={<Graficadora/>}/>
       </Routes>
     

      
    </div>
  )
}

export default App
