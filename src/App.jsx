import RoutesApp from './routes';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <RoutesApp />
    </BrowserRouter>
  )
}
export default App;
