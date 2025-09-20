"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyChartProps {
  weeklyStats: Record<string, number>; // your backend response
}

const WeeklyBookingChart: React.FC<WeeklyChartProps> = ({ weeklyStats }) => {
  // Ensure the days are in order: Monday → Sunday
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const labels = daysOrder;
  const dataValues = daysOrder.map((day) => weeklyStats[day] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: dataValues,
        backgroundColor: dataValues.map((value) =>
          value > 0 ? "rgba(54, 162, 235, 0.8)" : "rgba(200, 200, 200, 0.3)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Bookings by Day of Week" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Number of Bookings" },
      },
      x: {
        title: { display: true, text: "Day of Week" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default WeeklyBookingChart;
