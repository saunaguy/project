import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import GraphComponent from './Chart/Graph';
import Dash from "./Chart/dash";
import KakaoOauth from "./component/user/kakao";

import Header from "./Header/Header";
import HomePage from "./component/HomePage";
import '../src/css/App.css';


function App() {
  return (
    <BrowserRouter>
     <Header /> 
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/webgl" element={<Dash />} />
          <Route path="/chart" element={<GraphComponent />} />
          <Route path="/kakao" element={<KakaoOauth />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
