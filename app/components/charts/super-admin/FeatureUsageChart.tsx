"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { feature: "Attendance", usage: 92 },
  { feature: "Fees Management", usage: 78 },
  { feature: "Exams", usage: 64 },
  { feature: "Online Classes", usage: 48 },
  { feature: "Homework", usage: 71 },
  { feature: "SMS / Notification", usage: 39 },
];

export default function FeatureUsageChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow  py-10 h-108   ">
      <h3 className="text-lg font-semibold mb-3">
        Feature Usage Overview
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 60, bottom: 10 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            dataKey="feature"
            type="category"
            width={120}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, "Usage"]}
          />
          <Bar
            dataKey="usage"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
