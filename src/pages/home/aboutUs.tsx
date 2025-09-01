import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        Welcome to <span className="font-semibold text-primary">ThangGo</span>!
        We are passionate about making ground booking and sports management easy
        and accessible for everyone.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Our platform allows players, organizers, and enthusiasts to connect with
        the best sports facilities in their area. Whether you're looking to book
        a ground, join a challenge, or just explore, ThangGo has got you
        covered.
      </p>
      <p className="text-lg text-gray-700">
        Our mission is simple:{" "}
        <span className="italic">
          empowering communities through sports and technology.
        </span>
      </p>
    </div>
  );
};

export default AboutUs;
