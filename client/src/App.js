import './App.css';
import { Routes, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Room from './components/Room';
import "./fonts/Play Pretend.otf"

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={<Menu />} />
          <Route path='/:roomId' element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
