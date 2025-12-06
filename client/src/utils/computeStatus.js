// Retorna o status derivado de um registro (treinamento ou exame)
// Status possíveis: 'EM DIA', 'PRÓX DO VENCIMENTO', 'VENCIDO', 'CONCLUIDO'
// Regras:
// - Se o campo status === 'CONCLUIDO' -> retorna 'CONCLUIDO' (override manual)
// - Caso contrário calcula exclusivamente com base em createdAt + validade (meses)
// - Se não houver createdAt ou validade válidos -> 'EM DIA'
// - Se validade === 0 ou agora >= expiry -> 'VENCIDO'
// - Se faltar menos ou igual que thresholdDays para expiry -> 'PRÓX DO VENCIMENTO'
// - Senão -> 'EM DIA'

export function computeStatus(record, thresholdDays = 30) {
  if (!record) return "EM DIA";

  const statusField = String(record.status || "").toUpperCase();

  // Override manual: concluído sempre vence tudo
  if (statusField === "CONCLUIDO") return "CONCLUIDO";

  const createdAt = record.createdAt ? new Date(record.createdAt) : null;
  const validadeMonths =
    record.validade !== undefined && record.validade !== null
      ? Number(record.validade)
      : null;

  // Se não tivermos data/validade válidas, considerar EM DIA
  if (!createdAt || validadeMonths === null || isNaN(validadeMonths)) {
    return "EM DIA";
  }

  // Se validade é 0, já está vencido
  if (validadeMonths === 0) {
    return "VENCIDO";
  }

  const expiry = new Date(createdAt);
  expiry.setMonth(expiry.getMonth() + validadeMonths);

  const now = new Date();

  // Usar >= para considerar vencido se já chegou à data de expiração
  if (now >= expiry) return "VENCIDO";

  const diffMs = expiry - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // Threshold: se faltam 30 dias ou menos (ou até um pouco mais para capturar "próximo do vencimento")
  // Ajuste: 1 mês ≈ 30 dias, então se validade é 1, está próximo
  if (diffDays <= thresholdDays) return "PRÓX DO VENCIMENTO";

  return "EM DIA";
}

export default computeStatus;