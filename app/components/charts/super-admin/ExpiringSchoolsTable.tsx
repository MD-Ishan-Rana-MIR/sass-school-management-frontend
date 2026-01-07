"use client"

export default function ExpiringSchoolsTable() {
    const schools = [
        { name: "ABC School", plan: "Standard", expiry: "2026-01-15" },
        { name: "XYZ School", plan: "Basic", expiry: "2026-01-18" },
    ];

    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Expiring Soon</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left">
                        <th>School</th>
                        <th>Plan</th>
                        <th>Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    {schools.map((s, i) => (
                        <tr key={i} className="border-t">
                            <td>{s.name}</td>
                            <td>{s.plan}</td>
                            <td className="text-red-500">{s.expiry}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
