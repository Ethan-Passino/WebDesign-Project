import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <a className="App-link" href="/Login">click here to move to a fake login page</a>
        <img src={logo} className="App-logo" alt="logo" />
        <text>hehe react go spin</text>
        <p>
           <code> this may or may not be some placeholder text
           </code> </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
