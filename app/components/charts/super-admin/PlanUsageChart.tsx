import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { plan: "Basic", count: 50 },
    { plan: "Standard", count: 42 },
    { plan: "Premium", count: 32 },
];

export default function PlanUsageChart() {
    return (
        <div className="bg-white p-4 rounded-xl shadow h-108 py-10 ">
            <h3 className="font-semibold mb-2">Plan Usage</h3>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
