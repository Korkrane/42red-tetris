import './App.css';
import { Routes, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Room from './components/Room';
import PageNotFound from './components/PageNotFound';
import "./fonts/Play Pretend.otf"

function App() {
  return (
    <>
      <Routes>
          <Route exact path='/' element={<Menu />}></Route>
          <Route path='/:roomId' element={<Room />}></Route>
          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
