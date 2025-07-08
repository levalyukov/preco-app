import React from 'react';
import Header from './components/Header';
import Schedule from './components/Schedule';
import './styles/App.css'

const App: React.FC = () =>{
  return (
    <div className="App">
      <main id='app'>
          <Header/>
          <Schedule/>
      </main>
    </div>
  );
}

export default App;
