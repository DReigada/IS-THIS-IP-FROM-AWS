import React from 'react';
import './App.css';
import { IpChecker } from './components/ip-checker';

function App() {
  return (<>
    <div className="App">
      <header className="App-header">
        <h1>IS THIS IP FROM AWS?</h1>
        {/* <div style={{backgroundColor: "white", marginBottom: "30px"}}>
          <img width="100px" src='https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg'></img>
        </div> */}
      </header>
      <article className='App-content'>
        <IpChecker />
      </article>
      <footer className="App-footer">
        <p><a href='https://github.com/DReigada/aws-ip-space'>Source</a></p>
        <p>|</p>
        <p>Made by: <a href='https://github.com/DReigada'>dreigada</a></p>
      </footer>

    </div>
  </>);
}

export default App;
