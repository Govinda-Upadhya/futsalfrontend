import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} Futsal Admin. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
