import React, { Component } from 'react';
import Home from './containers/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  render() {
    return (
        <div className="container-fluid">
            <Header />
            <Home />
            <Footer />
        </div>
    )
  }
}

export default App;
