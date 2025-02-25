import Table from "./Table";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Compare from "./Compare";
import { AuthProvider } from "./AuthContext";
import Navbar from "./Navbar";
import { Profile } from "./Profile";
function App() {
  return (
    <div style={{ backgroundColor: "#d9d9d9"}}>
    <AuthProvider>
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
    </AuthProvider>
  </div>
  );
}

export default App;
