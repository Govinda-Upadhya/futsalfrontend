import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base_url } from "../../types/ground";

export default function Header({ active, setActive }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<{ name: string; image: string }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await axios.get(`${base_url}/admin/getAdmin`, {
          withCredentials: true,
        });
        setAdmin(res.data.admin);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    }
    fetchAdmin();
  }, []);

  return (
    <header className="bg-gray-900 text-white p-2 sm:p-4 sticky top-0 z-50 shadow-md w-full">
      <div className="container mx-auto flex flex-col sm:flex-row justify-around items-center gap-2">
        <div className="flex w-full sm:w-auto justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-bold">ThangGo</h1>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-gray-400 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Admin Profile Section */}
        {admin && (
          <li className="flex items-center space-x-2 sm:flex">
            <img
              src={admin.image}
              alt={admin.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{admin.name}</span>
          </li>
        )}

        {/* Navigation Menu */}
        <nav
          className={`w-full sm:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } sm:flex`}
        >
          <ul className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4 items-center mt-2 sm:mt-0">
            <li>
              <button
                onClick={() => setActive("dashboard")}
                className={`transition-colors ${
                  active === "dashboard"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => setActive("booking")}
                className={`transition-colors ${
                  active === "booking"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Bookings
              </button>
            </li>
            <li>
              <button
                onClick={() => setActive("addGround")}
                className={`transition-colors ${
                  active === "addGround"
                    ? "text-blue-500 font-semibold"
                    : "hover:text-gray-400"
                }`}
              >
                Add ground
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className={`transition-colors text-white font-semibold`}
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
