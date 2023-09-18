import RoutesApp from './routes';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header'
import { ReactNotifications } from 'react-notifications-component';

const App = () => {
  return (
    <BrowserRouter>
            <ReactNotifications />
      
      <Header />
      <RoutesApp />
    </BrowserRouter>
  )
}
export default App;
