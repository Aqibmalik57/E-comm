import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
);

// Common chart options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
      },
    },
    y: {
      grid: {
        color: "#f3f4f6",
      },
      ticks: {
        color: "#9ca3af",
        font: {
          size: 11,
        },
      },
    },
  },
};

// Line Chart for Revenue Trends
export const RevenueChart = ({ data, title }) => {
  const chartData = {
    labels: data?.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue",
        data: data?.revenue || [0, 0, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `Revenue: $${context.raw.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Bar Chart for Orders
export const OrdersChart = ({ data }) => {
  const chartData = {
    labels: data?.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: data?.orders || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#6366f1",
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const options = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (context) => `Orders: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div style={{ height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Doughnut Chart for Order Status
export const OrderStatusChart = ({ data }) => {
  const chartData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: data?.counts || [0, 0, 0, 0, 0],
        backgroundColor: [
          "#f59e0b", // Pending - Yellow
          "#3b82f6", // Processing - Blue
          "#8b5cf6", // Shipped - Purple
          "#10b981", // Delivered - Green
          "#ef4444", // Cancelled - Red
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div style={{ height: "280px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Doughnut Chart for Category Distribution
export const CategoryDistributionChart = ({ data }) => {
  const colors = [
    "#10b981", // green
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // yellow
    "#ef4444", // red
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        data: data?.values || [],
        backgroundColor: colors,
        borderWidth: 0,
        cutout: "65%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 15,
          color: "#6b7280",
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Top Products Bar Chart
export const TopProductsChart = ({ data }) => {
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: "Sales",
        data: data?.values || [],
        backgroundColor: [
          "#10b981",
          "#3b82f6",
          "#8b5cf6",
          "#f59e0b",
          "#ec4899",
        ],
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#f3f4f6",
        },
        ticks: {
          color: "#9ca3af",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "250px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
