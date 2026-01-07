"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "01 Jan", rate: 82 },
  { date: "02 Jan", rate: 85 },
  { date: "03 Jan", rate: 80 },
  { date: "04 Jan", rate: 88 },
  { date: "05 Jan", rate: 91 },
  { date: "06 Jan", rate: 86 },
  { date: "07 Jan", rate: 89 },
];

export default function AttendanceRateChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-108 py-10 ">
      <h3 className="text-lg font-semibold mb-3">
        Attendance Rate (Last 7 Days)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Attendance"]}
          />
          <Line
            type="monotone"
            dataKey="rate"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
