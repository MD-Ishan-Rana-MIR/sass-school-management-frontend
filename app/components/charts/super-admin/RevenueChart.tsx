"use client"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", revenue: 2200 },
    { month: "Feb", revenue: 3100 },
    { month: "Mar", revenue: 3800 },
    { month: "Apr", revenue: 4200 },
];

export default function RevenueChart() {
    return (
        <div className="bg-white p-4 rounded-xl shadow h-80 py-10 ">
            <h3 className="font-semibold mb-2">Monthly Revenue</h3>
            <ResponsiveContainer>
                <AreaChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area dataKey="revenue" stroke="#22c55e" fill="#bbf7d0" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
