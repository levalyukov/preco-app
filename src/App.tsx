import React from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';
import Schedule from './components/Schedule';
import Footer from './components/Footer';
import './styles/App.css'

const App: React.FC = () =>{
  return (
    <div className="App">
      <main id='app'>
          <Header/>
          <Schedule/>
          <Footer/>
      </main>
    </div>
  );
}

export default App;
