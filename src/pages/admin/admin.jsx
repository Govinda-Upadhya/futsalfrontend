import React, { useEffect, useState } from "react";
import Header from "../../components/admin/header";
import Footer from "../../components/admin/footer";
import Futsalcomponent from "../../components/admin/futsalcomponent";
import axios from "axios";
import Addground from "../../components/admin/addground";

const Admin = () => {
  const [active, setActive] = useState("dashboard");
  const [grounds, setGrounds] = useState([]);

  useEffect(() => {
    async function fetchGround() {
      const res = await axios.get("http://localhost:3001/admin/seeGrounds", {
        withCredentials: true,
      });
      if (res.status == 200) {
        console.log(res.data.grounds);
        setGrounds(res.data.grounds);
      } else {
        console.log("no grounds");
      }
    }
    fetchGround();
    return () => {};
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Header setActive={setActive} active={active} />
      {active == "dashboard" ? (
        <Futsalcomponent grounds={grounds} />
      ) : active == "booking" ? (
        <p>booking</p>
      ) : (
        <Addground />
      )}
      <Footer />
    </div>
  );
};

export default Admin;
