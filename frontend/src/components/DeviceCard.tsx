import React from "react";

type Props = {
    name: string;
    status: "online" | "offline";
};

export default function DeviceCard({ name, status }: Props) {
    const isOnline = status === "online";
    const bgColor = isOnline ? "#e6ffed" : "#ffeaea";
    const statusColor = isOnline ? "#27ae60" : "#c0392b";
    const statusText = isOnline ? "Online" : "Offline";
    const statusIcon = isOnline ? "🟢" : "🔴";

    return (
        <div
            style={{
                border: `1px solid ${statusColor}`,
                padding: "1rem",
                borderRadius: 8,
                background: bgColor,
                minWidth: 220,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
            aria-label={`Device ${name} is ${statusText}`}
        >
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{name}</h2>
            <p style={{ color: statusColor, fontWeight: 500, marginTop: 8 }}>
                <span aria-label={statusText} role="img">{statusIcon}</span> {statusText}
            </p>
        </div>
    );
}
