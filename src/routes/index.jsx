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
import Private from './Private'
import Statuses from '../pages/Statuses'
import PlayerMobile from '../pages/PlayerMobile'

const RoutesApp = () => {
    return (
    
        <Routes>
            <Route path='/' element={<Home />} />
            
            <Route path='login' element={ <LogIn/>} />
            <Route path='tutorial' element={ <Tutorial/>} />
            <Route path='signup' element={ <SignUp/>} />
            <Route path='playerlist' element={<Private><PlayerList/></Private> } />
            <Route path='playerrole' element={<Private><PlayerRole/></Private> } />
            <Route path='day' element={<Private><Day/></Private> } />
            <Route path='night' element={<Private><Night/></Private> } />
            <Route path='victory' element={<Private><Victory/></Private> } />
            <Route path='statuses' element={<Private><Statuses/></Private> } />
            <Route path='PlayerMobile' element={<PlayerMobile/>} />
        </Routes>        
    )
} 

export default RoutesApp