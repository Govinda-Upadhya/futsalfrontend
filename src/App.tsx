// App.tsx
import { Route, Routes } from "react-router-dom";
import "./App.css";

// Import User Pages
import HomePage from "./pages/home/home";
import BookingPage from "./components/booking/bookingpage";
import BookingPending from "./components/booking/bookingPending";
import AddChallengeForm from "./pages/user/addChallengeForm";
import AcceptChallenge from "./pages/user/acceptChallenge";
import AboutUs from "./pages/home/aboutUs";
import ContactUs from "./pages/home/contactUs";

// Import Admin Pages
import Adminsignup from "./pages/admin/adminsignup";
import Admin from "./pages/admin/admin";
import Adminsignin from "./pages/admin/adminlogin";
import Groundetails from "./pages/admin/groundetails";
import ForgotPassword from "./pages/admin/changePassword";
import ChangePasswordLink from "./pages/admin/changePasswordLink";
import AdminLayout from "./layout/adminLayout";
import UserLayout from "./layout/userlayout";
import AdminProtectedRoute from "./components/auth/protectRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} /> {/* The homepage */}
        <Route path="booking/:groundId" element={<BookingPage />} />
        <Route path="addChallenge" element={<AddChallengeForm />} />
        <Route path="acceptChallenge/:id" element={<AcceptChallenge />} />
        <Route path="users/booking/:booking_id" element={<BookingPending />} />
        <Route path="aboutus" element={<AboutUs />} />
        <Route path="contactus" element={<ContactUs />} />
      </Route>

      <Route path="/admin/signin" element={<Adminsignin />} />
      <Route path="/admin/signup" element={<Adminsignup />} />
      <Route path="/admin/changePassword" element={<ForgotPassword />} />
      <Route
        path="/admin/changePassword/:id"
        element={<ChangePasswordLink />}
      />

      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Admin />} />
          <Route path="ground/:id" element={<Groundetails />} />
          {/* Add any other routes that require admin authentication here */}
        </Route>
      </Route>

      {/* You can also have routes that don't belong to any layout, like a 404 page */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
