"use client"
export default function StatsCards() {
    const stats = [
        { title: "Total Schools", value: 124 },
        { title: "Active Schools", value: 97 },
        { title: "Monthly Revenue ($)", value: 4200 },
        { title: "Active Students", value: 15840 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow">
                    <p className="text-gray-500 text-sm">{s.title}</p>
                    <h2 className="text-2xl font-bold">{s.value}</h2>
                </div>
            ))}
        </div>
    );
}
