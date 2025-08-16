import React from "react";
import Groundcard from "./groundcard";

const Futsalcomponent = ({ grounds }) => {
  return (
    <main className="container mx-auto p-4 flex-grow">
      <h2 className="text-3xl font-bold text-gray-800 my-8 text-center">
        Grounds Management
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {grounds &&
          grounds.map((ground) => (
            <Groundcard key={ground._id} ground={ground} />
          ))}
      </div>
    </main>
  );
};

export default Futsalcomponent;
