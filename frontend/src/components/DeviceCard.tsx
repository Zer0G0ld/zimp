type Props = {
    name: string;
    status: "online" | "offline";
};

export default function DeviceCard({ name, status }: Props) {
    return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8 }}>
        <h2>{name}</h2>
        <p>Status: {status === "online" ? "🟢 Online" : "🔴 Offline"}</p>
    </div>
    );
}
