"use client";

import React, { useState } from "react";
import styles from "./devices.module.css";
import { CheckCircle, XCircle } from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: string;
  status: "Ativo" | "Inativo";
}

const mockDevices: Device[] = [
  { id: "1", name: "Sensor de Temperatura", type: "Sensor", status: "Ativo" },
  { id: "2", name: "Câmera de Segurança", type: "Câmera", status: "Inativo" },
  { id: "3", name: "Smart Plug", type: "Tomada", status: "Ativo" },
  { id: "4", name: "Sensor de Umidade", type: "Sensor", status: "Ativo" },
  { id: "5", name: "Câmera Externa", type: "Câmera", status: "Inativo" },
  { id: "6", name: "Smart Light", type: "Luz", status: "Ativo" },
  { id: "7", name: "Roteador WiFi", type: "Roteador", status: "Ativo" },
  { id: "8", name: "Sensor de Movimento", type: "Sensor", status: "Inativo" },
  { id: "9", name: "Câmera Interna", type: "Câmera", status: "Ativo" },
  { id: "10", name: "Smart Thermostat", type: "Termostato", status: "Ativo" },
];

export default function DevicesPage() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedDevices((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleEdit = () => {
    if (selectedDevices.length === 1) {
      alert(`Editar dispositivo: ${selectedDevices[0]}`);
    }
  };

  const handleRemove = () => {
    if (selectedDevices.length > 0) {
      alert(`Remover dispositivos: ${selectedDevices.join(", ")}`);
      setSelectedDevices([]);
    }
  };

  return (
    <main className={styles.deviceContainer}>
      <h1 className={styles.deviceHeader}>Dispositivos Encontrados</h1>

      <div className={styles.deviceActions}>
        <button
          className={styles.deviceButton}
          onClick={handleEdit}
          disabled={selectedDevices.length !== 1}
        >
          Editar
        </button>
        <button
          className={styles.deviceButton}
          onClick={handleRemove}
          disabled={selectedDevices.length === 0}
        >
          Remover
        </button>
      </div>

      <div className={styles.devicesGrid}>
        {mockDevices.map((device) => (
          <div
  key={device.id}
  className={`${styles.deviceInfo} ${
    selectedDevices.includes(device.id) ? styles.selected : ""
  }`}
  onClick={() => toggleSelection(device.id)} // clique no card inteiro
>
  <div className={styles.deviceHeaderRow}>
    {device.status === "Ativo" ? (
      <CheckCircle color="var(--color-success)" />
    ) : (
      <XCircle color="var(--color-danger)" />
    )}
    <span className={styles.deviceName}>{device.name}</span>
  </div>

  <div>
    <span className={styles.deviceLabel}>Tipo:</span>
    <span className={styles.deviceValue}>{device.type}</span>
  </div>

  <div>
    <span className={styles.deviceLabel}>Status:</span>
    <span
      className={styles.deviceValue}
      style={{
        color:
          device.status === "Ativo"
            ? "var(--color-success)"
            : "var(--color-danger)",
        fontWeight: 600,
      }}
    >
      {device.status}
    </span>
  </div>
</div>


        ))}
      </div>
    </main>
  );
}
