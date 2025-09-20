"use client";

import React, { useEffect, useState } from "react";
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

const LeftBookingChart = ({ timeRange, dailyTimeStats, weeklyStats }) => {
  // Days order for weekly chart
  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Prepare labels and data dynamically
  const labels = timeRange === "day" ? Object.keys(dailyTimeStats) : daysOrder;

  const dataValues =
    timeRange === "day"
      ? Object.values(dailyTimeStats)
      : daysOrder.map((day) => weeklyStats[day] || 0);

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
      title: {
        display: true,
        text:
          timeRange === "day"
            ? "Bookings Overview (Hourly)"
            : "Bookings Overview (Weekly)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Number of Bookings" },
      },
      x: {
        title: {
          display: true,
          text: timeRange === "day" ? "Time Slots" : "Day of Week",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default LeftBookingChart;
