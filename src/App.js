import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Admin from './Admin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Admin/>}/>
        </Routes> 
      </div>   
    </Router>
  );
}
export default App;
