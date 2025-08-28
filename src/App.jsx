import { Route, Router, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Adminsignup from "./pages/admin/adminsignup";
import Admin from "./pages/admin/admin";
import Adminsignin from "./pages/admin/adminlogin";
import Groundetails from "./pages/admin/groundetails";
import HomePage from "./pages/home/home";
import BookingPage from "./components/booking/bookingpage";
import BookingPending from "./components/booking/bookingPending";
import AddChallengeForm from "./pages/user/addChallengeForm";
import AcceptChallenge from "./pages/user/acceptChallenge";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:groundId" element={<BookingPage />} />
        <Route path="/addChallenge" element={<AddChallengeForm />} />
        <Route path="/acceptChallenge/:id" element={<AcceptChallenge />} />
        <Route path="/users/booking/:booking_id" element={<BookingPending />} />
        <Route element={<Admin />} path="/admin/dashboard" />
        <Route element={<Groundetails />} path="/admin/ground/:id" />
        <Route element={<Adminsignup />} path="/admin/signup" />
        <Route element={<Adminsignin />} path="/admin/signin" />
      </Routes>
    </>
  );
}

export default App;
