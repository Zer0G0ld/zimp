// frontend/src/app/dashboard/page.tsx
import { Server, Zap, ShieldCheck, Circle } from "lucide-react";
import styles from "./dashboard.module.css";

const devices: { name: string; type: "server" | "switch" | "firewall"; status: "online" | "offline" }[] = [
  { name: "Servidor A", type: "server", status: "online" },
  { name: "Switch Core", type: "switch", status: "offline" },
  { name: "Firewall", type: "firewall", status: "online" },
  { name: "Servidor B", type: "server", status: "offline" },
  { name: "Switch Distribuição", type: "switch", status: "online" },
  { name: "Firewall Backup", type: "firewall", status: "offline" },
  { name: "Servidor C", type: "server", status: "online" },
  { name: "Switch Acesso", type: "switch", status: "online" },
  { name: "Firewall Secundário", type: "firewall", status: "online" },
  { name: "Servidor D", type: "server", status: "offline" },
  { name: "Switch Remoto", type: "switch", status: "offline" },
  { name: "Firewall Terciário", type: "firewall", status: "online" },
];

// Função auxiliar para escolher o ícone com base no tipo do dispositivo
function DeviceIcon({ type }: { type: string }) {
  switch (type) {
    case "server":
      return <Server size={32} />;
    case "switch":
      return <Zap size={32} />;
    case "firewall":
      return <ShieldCheck size={32} />;
    default:
      return <Server size={32} />;
  }
}

// Função auxiliar para cor do status
function StatusIndicator({ status }: { status: "online" | "offline" }) {
  return (
    <Circle
      size={12}
      color={status === "online" ? "green" : "red"}
      style={{ marginLeft: "0.5rem" }}
    />
  );
}

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardHeader}>Dashboard</h1>

      <div className={styles.dashboardContent}>
        <div style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "stretch"
        }}>
          {devices.map(device => (
            <div key={device.name} className={styles.dashboardCard}>
              <DeviceIcon type={device.type} />
              <div>
                <strong>{device.name}</strong>
                <div>Status: {device.status} <StatusIndicator status={device.status} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
