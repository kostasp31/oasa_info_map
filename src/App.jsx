import { useState, useRef, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

import Map from "./Map";

import { getLineByCode } from "./api/oasa_requests";

function App() {
  return (
    <div style={{width:'100vw', height:'100vh'}}>
      <Map />
      <div style={{position:'absolute', width:'280px', height:'400px', background:'#ffffff', right:20, bottom: 20, opacity:0.90}}>
        <button onClick={() => getLineByCode(608)}>Get lines</button>
      </div>
    </div>
  );
}

export default App;
