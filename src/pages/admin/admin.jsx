import React, { useEffect, useState } from "react";
import Header from "../../components/admin/header";
import Footer from "../../components/admin/footer";
import Futsalcomponent from "../../components/admin/futsalcomponent";
import axios from "axios";
import Addground from "../../components/admin/addground";
import Booking from "./adminBooking";
import { base_url } from "../../types/ground";
const Admin = () => {
  const [active, setActive] = useState("dashboard");
  const [grounds, setGrounds] = useState([]);

  useEffect(() => {
    async function fetchGround() {
      try {
        const res = await axios.get(`${base_url}/admin/seeGrounds`, {
          withCredentials: true,
        });
        if (res.status == 200) {
          setGrounds(res.data.grounds);
        } else {
          alert("You havent registered any grounds");
        }
      } catch (error) {
        alert("You have not registered any grounds yet");
      }
    }
    fetchGround();
    return () => {};
  }, []);
  return (
  <div className="flex flex-col min-h-screen bg-gray-100 font-sans w-full">
      <Header setActive={setActive} active={active} />
      {active == "dashboard" ? (
        <Futsalcomponent grounds={grounds} />
      ) : active == "booking" ? (
        <Booking />
      ) : (
        <Addground />
      )}
      <Footer />
    </div>
  );
};

export default Admin;
