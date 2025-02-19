import Table from "./Table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Compare from "./Compare";
import { AuthProvider } from "./AuthContext";
import Navbar from "./Navbar";
;


function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
