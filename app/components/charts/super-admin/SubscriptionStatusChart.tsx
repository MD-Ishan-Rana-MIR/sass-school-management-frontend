"use client"
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
    { name: "Active", value: 97 },
    { name: "Expired", value: 17 },
    { name: "Trial", value: 10 },
];

const COLORS = ["#22c55e", "#ef4444", "#facc15"];

export default function SubscriptionStatusChart() {
    return (
        <div className="bg-white p-4 rounded-xl shadow h-108">
            <h3 className="font-semibold mb-2">Subscription Status</h3>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} innerRadius={60} outerRadius={100} dataKey="value">
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
