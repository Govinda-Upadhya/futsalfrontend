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

interface BookingChartProps {
  timeStats: Record<string, number>;
  timeRange: string;
}

const BookingChart: React.FC<BookingChartProps> = ({
  timeStats,
  timeRange,
}) => {
  // Sort the slots by start hour
  const sortedSlots = Object.keys(timeStats).sort((a, b) => {
    const startA = parseInt(a.split(":")[0], 10); // get hour from "HH:MM-HH:MM"
    const startB = parseInt(b.split(":")[0], 10);
    return startA - startB;
  });

  const data = {
    labels: sortedSlots,
    datasets: [
      {
        label: "Bookings",
        data: sortedSlots.map((slot) => timeStats[slot]),
        backgroundColor: sortedSlots.map((slot) =>
          timeStats[slot] > 0
            ? "rgba(54, 162, 235, 0.8)"
            : "rgba(200, 200, 200, 0.3)"
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Bookings by ${timeRange}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Number of Bookings" },
      },
      x: {
        title: { display: true, text: "Time Slots" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BookingChart;
