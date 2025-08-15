import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Adminsignup from "./pages/admin/adminsignup";
import Admin from "./pages/admin/admin";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Admin />} path="/admin" />
        <Route element={<Adminsignup />} path="/admin/signup" />
      </Routes>
    </>
  );
}

export default App;
