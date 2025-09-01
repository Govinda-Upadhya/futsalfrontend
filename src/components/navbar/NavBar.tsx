import React, { useState } from "react";
// 1. Import NavLink instead of Link
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.svg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }): string => {
    const baseClasses = "font-bold transition";

    const activeClasses = "text-white underline underline-offset-4";
    const inactiveClasses = "text-gray-300 hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getMobileNavLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
  }): string => {
    const baseClasses = "block font-bold transition py-2";
    const activeClasses = "text-white bg-green-600 rounded px-2";
    const inactiveClasses = "text-gray-300 hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-[#1AA148] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center gap-2 text-white">
            <img src={logo} alt="ThangGo Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold">ThangGo</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/aboutus" className={getNavLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/contactus" className={getNavLinkClass}>
              Contact Us
            </NavLink>

            <NavLink to="/admin/signin" className={getNavLinkClass}>
              Login
            </NavLink>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#1AA148] shadow-md">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <NavLink
              to="/aboutus"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </NavLink>
            <NavLink
              to="/contactus"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </NavLink>
            <NavLink
              to="/owner-login"
              className={getMobileNavLinkClass}
              onClick={() => setIsOpen(false)}
            >
              Ground Owner Login
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
