import './App.css';
import { Routes, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import Lobby from './components/Lobby';

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={<Menu />}></Route>
          <Route path='/:roomId' element={<Lobby />}></Route>
      </Routes>
    </>
  );
}

export default App;
