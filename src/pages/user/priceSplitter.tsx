import React, { useState } from "react";

export default function GroundFeeSplitCalculator() {
  const [pricePerHour, setPricePerHour] = useState(1500);
  const [hours, setHours] = useState(1);
  const [loserPercent, setLoserPercent] = useState(70);

  // calculations
  const totalPrice = pricePerHour * hours;
  const downPayment = totalPrice * 0.1;
  const remainingAmount = totalPrice - downPayment;

  // share split
  const loserShareRemaining = (remainingAmount * loserPercent) / 100;
  const winnerShareRemaining = remainingAmount - loserShareRemaining;

  // proportional refund logic (Option 2)
  const loserRefund = (downPayment * loserPercent) / 100;
  const winnerRefund = (downPayment * (100 - loserPercent)) / 100;

  // final total each team pays
  const loserFinalPay = loserShareRemaining + loserRefund;
  const winnerFinalPay = winnerShareRemaining + winnerRefund;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-emerald-700 text-center">
        Ground Fee Split
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Price Per Hour</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Hours</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Losing Team %</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={loserPercent}
            onChange={(e) => setLoserPercent(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-emerald-50 p-4 rounded-xl space-y-4">
        <h3 className="text-xl font-semibold text-emerald-700 text-center">
          Summary
        </h3>

        <div className="space-y-2">
          <p>
            <strong>Total Price:</strong> Rs {totalPrice}
          </p>
          <p>
            <strong>Down Payment (10%):</strong> Rs {downPayment}
          </p>
          <p>
            <strong>Amount to Be Paid After Match:</strong> Rs {remainingAmount}
          </p>
        </div>

        {/* Simple Split */}
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-semibold">Team Split</h4>
          <p>
            <strong>Losing Team Base Share:</strong> Rs {loserShareRemaining}
          </p>
          <p>
            <strong>Winning Team Base Share:</strong> Rs {winnerShareRemaining}
          </p>
        </div>

        {/* Refund Visual */}
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-semibold">Down Payment Adjustment</h4>
          <p>Losing team refunds: Rs {loserRefund}</p>
          <p>Winning team refunds: Rs {winnerRefund}</p>
        </div>

        {/* Final */}
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-semibold">Final Amount Each Team Pays</h4>
          <p className="text-red-700 text-lg">
            <strong>Losing Team:</strong> Rs {loserFinalPay}
          </p>
          <p className="text-green-700 text-lg">
            <strong>Winning Team:</strong> Rs {winnerFinalPay}
          </p>
        </div>
      </div>
    </div>
  );
}
