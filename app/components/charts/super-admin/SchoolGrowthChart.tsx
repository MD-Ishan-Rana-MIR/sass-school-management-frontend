"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", schools: 20 },
    { month: "Feb", schools: 35 },
    { month: "Mar", schools: 55 },
    { month: "Apr", schools: 78 },
];

export default function SchoolGrowthChart() {
    return (
        <div className="bg-white p-4 rounded-xl shadow h-80 py-10 ">
            <h3 className="font-semibold mb-2">Monthly School Growth</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="schools" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
