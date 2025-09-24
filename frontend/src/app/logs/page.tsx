"use client";

import React from "react";
import styles from "./logs.module.css";
import { Info, AlertTriangle, XCircle } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

const mockLogs: LogEntry[] = [
  { id: "1", timestamp: "2025-09-24 09:00:12", level: "INFO", message: "Servidor iniciado com sucesso." },
  { id: "2", timestamp: "2025-09-24 09:05:45", level: "ERROR", message: "Conexão instável com o dispositivo X." },
  { id: "3", timestamp: "2025-09-24 09:10:03", level: "ERROR", message: "Falha ao salvar dados do dispositivo Y." },
  { id: "4", timestamp: "2025-09-24 09:15:27", level: "INFO", message: "Dispositivo Z conectado." },
  { id: "5", timestamp: "2025-09-24 09:20:33", level: "WARN", message: "Uso de memória elevado." },
  { id: "6", timestamp: "2025-09-24 09:25:50", level: "ERROR", message: "Erro ao enviar notificação por e-mail." },
  { id: "7", timestamp: "2025-09-24 09:30:15", level: "ERROR", message: "Backup realizado com sucesso." },
  { id: "8", timestamp: "2025-09-24 09:35:42", level: "WARN", message: "Tentativa de login falhou para o usuário admin." },
  { id: "9", timestamp: "2025-09-24 09:40:58", level: "ERROR", message: "Dispositivo W desconectado inesperadamente." },
  { id: "10", timestamp: "2025-09-24 09:45:21", level: "INFO", message: "Atualização do sistema concluída." },
  { id: "11", timestamp: "2025-09-24 09:00:12", level: "INFO", message: "Servidor iniciado com sucesso." },
  { id: "12", timestamp: "2025-09-24 09:05:45", level: "ERROR", message: "Conexão instável com o dispositivo X." },
  { id: "13", timestamp: "2025-09-24 09:10:03", level: "ERROR", message: "Falha ao salvar dados do dispositivo Y." },
  { id: "14", timestamp: "2025-09-24 09:15:27", level: "INFO", message: "Dispositivo Z conectado." },
  { id: "15", timestamp: "2025-09-24 09:20:33", level: "WARN", message: "Uso de memória elevado." },
  { id: "16", timestamp: "2025-09-24 09:25:50", level: "ERROR", message: "Erro ao enviar notificação por e-mail." },
  { id: "17", timestamp: "2025-09-24 09:30:15", level: "ERROR", message: "Backup realizado com sucesso." },
  { id: "18", timestamp: "2025-09-24 09:35:42", level: "WARN", message: "Tentativa de login falhou para o usuário admin." },
  { id: "19", timestamp: "2025-09-24 09:40:58", level: "ERROR", message: "Dispositivo W desconectado inesperadamente." },
  { id: "20", timestamp: "2025-09-24 09:45:21", level: "INFO", message: "Atualização do sistema concluída." },
  { id: "21", timestamp: "2025-09-24 09:00:12", level: "INFO", message: "Servidor iniciado com sucesso." },
];

// Ícones por nível
const logIcons = {
  INFO: <Info size={25} stroke="currentColor" />,
  WARN: <AlertTriangle size={25} stroke="currentColor" />,
  ERROR: <XCircle size={25} stroke="currentColor" />,
};



export default function LogsPage() {
  return (
    <main className={styles.logsContainer}>
      <h1 className={styles.logsHeader}>Logs do Sistema</h1>

      <div className={styles.logsGrid}>
        {mockLogs.map((log) => (
          <div key={log.id} className={styles.logItem}>
            <span className={styles.logTimestamp}>{log.timestamp}</span>

            {/* Badge do nível com ícone */}
            <span className={`${styles.logLevel} ${styles[log.level.toLowerCase()]}`}>
              {logIcons[log.level]} 
              <span style={{ marginLeft: "0.25rem" }}>{log.level}</span>
            </span>

            <span className={styles.logMessage}>{log.message}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
