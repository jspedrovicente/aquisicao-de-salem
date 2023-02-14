import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import SignUp from '../pages/SignUp'
import Tutorial from '../pages/Tutorial'
import PlayerList from '../pages/PlayerList'
import PlayerRole from '../pages/PlayerRole'
import Day from '../pages/Day'
import Night from '../pages/Night'
import Victory from '../pages/Victory'


const RoutesApp = () => {
    return (
    
        <Routes>
            <Route path='/' element={<Home />} />
            
            <Route path='login' element={ <LogIn/>} />
            <Route path='signup' element={ <SignUp/>} />
        </Routes>        
    )
} 

export default RoutesApp