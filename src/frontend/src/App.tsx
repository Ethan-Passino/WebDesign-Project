import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Home} from "./pages/Home";

const App: React.FC = () => {
  return(
    <div className="App">
      <BrowserRouter>
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
