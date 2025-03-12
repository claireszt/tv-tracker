import React from "react";

interface StatusPillProps {
  status: string;
}

const statusColors: Record<string, string> = {
  Ended: "bg-red-300 text-red-800", // Soft red
  Continuing: "bg-green-300 text-green-800", // Soft green
  Upcoming: "bg-blue-300 text-blue-800", // Soft blue
  Unknown: "bg-gray-300 text-gray-800", // Soft gray
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <div
      className={`px-3 py-1 text-sm text-white rounded-full ${
        statusColors[status] || "bg-gray-500"
      }`}
    >
      {status}
    </div>
  );
};

export default StatusPill;
