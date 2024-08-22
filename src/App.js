import {NumberGame} from "./component/NumberGame";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={"/"} element={<NumberGame/>}/>
      </Routes>
    </Router>
  );
}

export default App;
