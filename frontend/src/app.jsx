import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./app.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
    </div>
  );
}

export default App;