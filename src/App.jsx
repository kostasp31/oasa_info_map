import { useState, useRef, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

import Map from "./Map";
import Overlay from "./Overlay";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map />
      <Overlay />
    </div>
  );
}

export default App;
