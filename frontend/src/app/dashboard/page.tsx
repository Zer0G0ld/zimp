import DeviceCard from "@/components/DeviceCard";

export default function DashboardPage() {
return (
    <div>
    <h1>📊 Dashboard</h1>
    <div style={{ display: "flex", gap: "1rem" }}>
        <DeviceCard name="Servidor A" status="online" />
        <DeviceCard name="Switch Core" status="offline" />
    </div>
    </div>
);
}
