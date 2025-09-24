import React from "react";
import styles from "./devices.module.css";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
}

const mockDevices: Device[] = [
  { id: "1", name: "Sensor de Temperatura", type: "Sensor", status: "Ativo" },
  { id: "2", name: "Câmera de Segurança", type: "Câmera", status: "Inativo" },
  { id: "3", name: "Smart Plug", type: "Tomada", status: "Ativo" },
];

export default function DevicesPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dispositivos Encontrados</h1>
      <ul className={styles.list}>
        {mockDevices.map((device) => (
          <li key={device.id} className={styles.deviceItem}>
            <div className={styles.deviceName}>{device.name}</div>
            <div>Tipo: {device.type}</div>
            <div>Status: {device.status}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}