import './App.css';
import { Routes, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Lobby from './components/Lobby';
import PageNotFound from './components/PageNotFound';

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={<Menu />}></Route>
          <Route path='/:roomId' element={<Lobby />}></Route>
          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
