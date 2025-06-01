import { useState, useRef, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style

import Map from "./Map";
import Overlay from "./Overlay";

const queryClient = new QueryClient();

function App() {
  const mapRef = useRef();

  return (
      <QueryClientProvider client={queryClient}>
        <div style={{ width: "100vw", height: "100vh" }}>
          <Map mapRef={mapRef} />
          <Overlay mapRef={mapRef} />
        </div>
      </QueryClientProvider>
  );
}

export default App;
