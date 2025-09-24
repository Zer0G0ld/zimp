// src/app/page.tsx
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>👋 Bem-vindo ao ZIMP</h1>
      <p className={styles.subtitle}>
        Selecione uma opção no menu lateral para começar.
      </p>
      {/* Informações adicionais para tornar a página mais completa */}
    <section className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>Sobre o ZIMP</h2>
      <p className={styles.sectionText}>
        ZIMP é uma plataforma inovadora para gerenciamento de projetos e tarefas. 
        Organize seu trabalho, colabore com sua equipe e aumente sua produtividade.
      </p>
    </section>
    <section className={styles.featuresSection}>
      <h2 className={styles.sectionTitle}>Principais Funcionalidades</h2>
      <ul className={styles.featuresList}>
        <li>✔️ Gerenciamento de tarefas</li>
        <li>✔️ Colaboração em tempo real</li>
        <li>✔️ Relatórios e estatísticas</li>
        <li>✔️ Interface intuitiva</li>
      </ul>
    </section>
    </div>
    
    
  );
}