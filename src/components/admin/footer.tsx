import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-2 sm:p-4 mt-auto w-full">
      <div className="container mx-auto text-center text-xs sm:text-base">
        <p>
          &copy; {new Date().getFullYear()} Futsal Admin. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
