import React, { useState, useMemo } from "react";

export default function GroundFeeSplitCalculator() {
  const [pricePerHour, setPricePerHour] = useState(1500);
  const [hours, setHours] = useState(1);
  const [loserPercent, setLoserPercent] = useState(70);
  const [matchFormat, setMatchFormat] = useState("6v6");
  const [advanceTeam, setAdvanceTeam] = useState("winner");

  // Compute values dynamically whenever inputs change
  const { totalPrice, downPayment, loserTeamPay, winnerTeamPay, notice } =
    useMemo(() => {
      const totalPrice = pricePerHour * hours;
      const downPayment = totalPrice * 0.1;
      const loserTeamPay = (totalPrice * loserPercent) / 100;
      const winnerTeamPay = totalPrice - loserTeamPay;

      const totalPlayers = parseInt(matchFormat.split("v")[0]) || 1;

      let notice = "";
      if (advanceTeam === "winner") {
        const perPersonPaymentWinner = winnerTeamPay / totalPlayers;
        const advancePayerMoney = downPayment - perPersonPaymentWinner;
        console.log(advancePayerMoney);
        if (advancePayerMoney > 0) {
          notice = `The person who paid advance will get back ${Math.abs(
            advancePayerMoney
          )} from losing team`;
        } else {
          notice = `The person who paid advance will have to pay only ${Math.abs(
            advancePayerMoney
          )}`;
        }
      } else {
        const perPersonPaymentLoser = loserTeamPay / totalPlayers;
        console.log("loser advance", perPersonPaymentLoser);
        const advancePayerMoney = downPayment - perPersonPaymentLoser;

        if (advancePayerMoney > 0) {
          notice = `The person who paid advance will pay only ${Math.abs(
            advancePayerMoney
          )}`;
        } else {
          notice = `The person who paid advance will have to get back ${Math.abs(
            advancePayerMoney
          )} from its team members`;
        }
      }

      return { totalPrice, downPayment, loserTeamPay, winnerTeamPay, notice };
    }, [pricePerHour, hours, loserPercent, matchFormat, advanceTeam]);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-emerald-700 text-center">
        Ground Fee Split Calculator
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Price Per Hour (Rs)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Total Hours</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Losing Team Payment (%)</label>
          <input
            type="number"
            className="w-full p-2 border rounded-xl"
            value={loserPercent}
            onChange={(e) => setLoserPercent(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Match Format</label>
          <input
            type="text"
            className="w-full p-2 border rounded-xl"
            placeholder="e.g., 6v6"
            value={matchFormat}
            onChange={(e) => setMatchFormat(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Advance Paid By (Team)</label>
          <select
            className="w-full p-2 border rounded-xl"
            value={advanceTeam}
            onChange={(e) => setAdvanceTeam(e.target.value)}
          >
            <option value="winner">Winning Team</option>
            <option value="loser">Losing Team</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-emerald-50 p-4 rounded-xl space-y-4">
        <h3 className="text-xl font-semibold text-emerald-700 text-center">
          Final Payment Breakdown
        </h3>

        <p className="text-lg">
          <strong>Total Ground Price:</strong> Rs {totalPrice}
        </p>
        <p className="text-lg">
          <strong>Down Payment (10%):</strong> Rs {downPayment}
        </p>

        <div className="border-t pt-3 space-y-3">
          <h4 className="font-semibold">Team Payment Split</h4>
          <p>
            <strong>Losing Team Pays:</strong> Rs {loserTeamPay}
          </p>
          <p>
            <strong>Winning Team Pays:</strong> Rs {winnerTeamPay}
          </p>
        </div>

        <div className="border-t pt-3 space-y-3">
          <h4 className="font-semibold">Advance Payer Final Amount</h4>
          <p className="text-blue-700 text-lg">
            <strong>{notice}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
