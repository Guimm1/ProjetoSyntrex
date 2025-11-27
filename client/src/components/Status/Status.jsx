// src/components/Status/Status.jsx
import styles from "./Status.module.css";

export default function Status({ value }) {
  const text = (value || "").toString();

  const normalized = text.trim().toLowerCase();

  let cls = styles.emAberto;
  if (normalized.includes("concl")) cls = styles.concluido;
  else if (normalized.includes("pend")) cls = styles.pendente;
  else if (normalized.includes("venc") || normalized.includes("próx") || normalized.includes("prox")) cls = styles.vencimento;

  return <span className={`${styles.badge} ${cls}`}>{text || "EM ABERTO"}</span>;
}
