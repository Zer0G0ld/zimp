import DeviceCard from "@/components/DeviceCard";

const devices: { name: string; status: "online" | "offline" }[] = [
    { name: "Servidor A", status: "online" },
    { name: "Switch Core", status: "offline" },
    { name: "Firewall", status: "online" },
];

export default function DashboardPage() {
    return (
        <div>
            <h1>📊 Dashboard</h1>
            <div style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "stretch"
            }}>
                {devices.map(device => (
                    <DeviceCard key={device.name} {...device} />
                ))}
            </div>
        </div>
    );
}
