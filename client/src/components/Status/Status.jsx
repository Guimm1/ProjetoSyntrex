// src/components/Status/Status.jsx
import styles from "./Status.module.css";

export default function Status({ value }) {
  const text = (value || "").toString();
  const trimmed = text.trim();
  const normalized = trimmed.toLowerCase();

  // Se já vier com a forma "CONCLUIDO em DD/MM/YYYY", preservar o texto completo
  if (/^conclu[ií]do em /i.test(trimmed)) {
    return <span className={`${styles.badge} ${styles.concluido}`}>{trimmed}</span>;
  }

  // Mapeamento de status para exibição
  let displayText = trimmed;
  let cls = styles.emAberto;

  // Mapeamento de status internos para display
  if (normalized.includes("aberto")) {
    displayText = "EM DIA";
    cls = styles.emAberto;  // Usar cor azul para "em dia"
  } else if (normalized.includes("concl")) {
    displayText = "CONCLUIDO";
    cls = styles.concluido;
  } else if (normalized.includes("pend")) {
    displayText = "VENCIDO";  // Pendente exibe como VENCIDO
    cls = styles.pendente;     // Usar cor vermelha
  } else if (normalized.includes("venc") || normalized.includes("próx") || normalized.includes("prox")) {
    displayText = trimmed;
    cls = styles.vencimento;
  }

  return <span className={`${styles.badge} ${cls}`}>{displayText || "EM DIA"}</span>;
}
