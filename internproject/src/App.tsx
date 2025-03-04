import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./assets/context/AuthContext";
import Navbar from "./Navbar";
import Table from "./Table";
import { TranslationProvider } from "./assets/context/TranslationContext"; // Import the TranslationProvider
import Compare from "./Compare";
import Login from "./Login";
import { Profile } from "./Profile";
import Signup from "./Signup";
import { SearchProvider } from "./assets/context/SearchContext";

function App() {
  return (
    <div style={{ backgroundColor: "#f5f5f5" }}>
      <AuthProvider>
        <TranslationProvider>
          <SearchProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Table />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </BrowserRouter>
          </SearchProvider>
        </TranslationProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
