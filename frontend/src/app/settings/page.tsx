"use client";

import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import { User, Mail, Sun, Moon, Bell, Save, RefreshCw } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface SettingsForm {
  username: string;
  email: string;
  theme: "light" | "dark";
  notifications: boolean;
}

export default function SettingsPage() {
  const defaultForm: SettingsForm = {
    username: "admin",
    email: "admin@example.com",
    theme: "light",
    notifications: true,
  };

  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState<SettingsForm>(defaultForm);
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

  // Carrega do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const parsed: SettingsForm = JSON.parse(saved);
      setFormData(parsed);
      setTheme(parsed.theme);
      applyTheme(parsed.theme);
    } else {
      applyTheme(defaultForm.theme);
    }
  }, []);

  const applyTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  const handleThemeChange = (value: "light" | "dark") => {
    setTheme(value);
    setFormData(prev => ({ ...prev, theme: value }));
    applyTheme(value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement
        ? target.type === "checkbox"
          ? target.checked
          : target.value
        : target.value;
    const name = target.name;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "theme") applyTheme(value as "light" | "dark");
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.username.trim()) newErrors.username = "Nome de usuário é obrigatório";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "E-mail inválido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem("settings", JSON.stringify(formData));
    alert("Configurações salvas com sucesso!");
  };

  const handleReset = () => {
    setFormData(defaultForm);
    setTheme(defaultForm.theme);
    applyTheme(defaultForm.theme);
    setErrors({});
    localStorage.removeItem("settings");
  };

  return (
    <main className={styles.settingsContainer} style={{ marginLeft: "250px" }}>
      <h1 className={styles.settingsHeader}>Configurações</h1>

      <form className={styles.settingsForm} onSubmit={handleSubmit}>
        {/* Perfil */}
        <h2 className={styles.settingsSection}>Perfil</h2>

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabelIcon}>
            <User size={16} /> Nome de Usuário
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={validate}
            className={styles.formInput}
            title={errors.username}
          />
          {errors.username && <small className={styles.errorText}>{errors.username}</small>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabelIcon}>
            <Mail size={16} /> E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={validate}
            className={styles.formInput}
            title={errors.email}
          />
          {errors.email && <small className={styles.errorText}>{errors.email}</small>}
        </div>

        {/* Preferências */}
        <h2 className={styles.settingsSection}>Preferências</h2>

        <div className={styles.formGroup}>
          <label htmlFor="theme" className={styles.formLabelIcon}>
            {formData.theme === "light" ? <Sun size={16} /> : <Moon size={16} />} Tema
          </label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={(e) => handleThemeChange(e.target.value as "light" | "dark")}
            className={styles.formInput}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </div>

        <div className={styles.formGroupCheckbox}>
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={formData.notifications}
            onChange={handleChange}
          />
          <label htmlFor="notifications" className={styles.formLabelIcon}>
            <Bell size={16} /> Receber notificações
          </label>
        </div>

        {/* Ações */}
        <div className={styles.formActions}>
          <button type="submit" className={styles.formButton}>
            <Save size={16} /> Salvar
          </button>
          <button type="button" className={styles.formButtonSecondary} onClick={handleReset}>
            <RefreshCw size={16} /> Resetar
          </button>
        </div>
      </form>
    </main>
  );
}
