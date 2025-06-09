import React from 'react'
import Graficadora from './modules/editor/page/Graficadora.jsx'
import { Route, Routes } from 'react-router-dom'
import { ProyectoContext } from './modules/proyectos/context/proyecto_context.jsx'
import AppRoutes from './modules/routers/index.jsx'
import GeminiChat from './modules/Gemini AI/index.jsx'

function App() {

  return (
  /* <div className="App" style={{ height: '100vh', width: '100%' ,backgroundColor: 'white'}}>

      
       <Routes>
        <Route path='/' element={<Graficadora/>}/>
        <Route element={<ProyectoContext/>}>
            <Route path='/misproyectos' element={<PagesMisProyectos/>}/>
            <Route path='/misproyectos/board/:id_board' element={<Graficadora/>}/>
            <Route path='/chat' element={<GeminiChat/>}/>
        </Route>
        
       
       </Routes>
     

      
    </div> */


    <>
     <AppRoutes/>
    
    </>



    


  )
}

export default App
