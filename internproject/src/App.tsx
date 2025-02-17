import React, { useState } from "react";
import Navbar from "./Navbar"
import Table from "./Table"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar/>
      <Table />
    </div>
  );
}

export default App;
