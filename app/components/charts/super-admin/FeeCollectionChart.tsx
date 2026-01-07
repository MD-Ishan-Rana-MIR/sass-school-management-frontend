"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", collected: 120000, due: 30000 },
  { month: "Feb", collected: 135000, due: 25000 },
  { month: "Mar", collected: 150000, due: 20000 },
  { month: "Apr", collected: 145000, due: 28000 },
  { month: "May", collected: 160000, due: 18000 },
];

export default function FeeCollectionChart() {
  return (
    <div className="bg-white p-4 rounded-xl shadow h-108 py-10  ">
      <h3 className="text-lg font-semibold mb-3">
        Fee Collection Overview (Monthly)
      </h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              [`৳${value.toLocaleString()}`, "Amount"]
            }
          />
          <Legend />
          <Bar dataKey="collected" name="Collected" radius={[6, 6, 0, 0]} />
          <Bar dataKey="due" name="Due" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
