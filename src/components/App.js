import React, { Component } from 'react';
import ContentAdmin from './ContentAdmin';
import logo from '../logo.svg';
import './App.css';
import 'antd/dist/antd.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <ContentAdmin/>
      </div>
    );
  }
}

export default App;
