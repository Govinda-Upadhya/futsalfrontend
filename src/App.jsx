import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Adminsignup from "./pages/admin/adminsignup";
import Admin from "./pages/admin/admin";
import Adminsignin from "./pages/admin/adminlogin";
import Groundetails from "./pages/admin/groundetails";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Admin />} path="/admin/dashboard" />
        <Route element={<Groundetails />} path="/admin/ground/:id" />
        <Route element={<Adminsignup />} path="/admin/signup" />
        <Route element={<Adminsignin />} path="/admin/signin" />
      </Routes>
    </>
  );
}

export default App;
