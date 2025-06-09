import React from 'react'
// import Graficadora from './modules/editor/page/Graficadora.jsx'
// import { PagesMisProyectos } from './modules/proyectos/pages/pages_proyectos.jsx'
// import { Route, Routes } from 'react-router-dom'
// import { ProyectoContext } from './modules/proyectos/context/proyecto_context.jsx'
import AppRoutes from './modules/routers/index.jsx'

function App() {

  return (
    //  <div className="App" style={{ height: '100vh', width: '100%' ,backgroundColor: 'white'}}>


    //      <Routes>
    //       <Route path='/' element={<Graficadora/>}/>
    //       <Route element={<ProyectoContext/>}>
    //           <Route path='/misproyectos' element={<PagesMisProyectos/>}/>
    //           <Route path='/misproyectos/board/:id_board' element={<Graficadora/>}/>
    //       </Route>


    //      </Routes>



    //   </div> 

    <>
      <AppRoutes />
    </>




  )
}

export default App
