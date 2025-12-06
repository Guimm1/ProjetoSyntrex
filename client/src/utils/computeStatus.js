// Retorna o status derivado de um registro (treinamento ou exame)
// Regras:
// - Se o campo status === 'CONCLUIDO' -> retorna 'CONCLUIDO' (override manual)
// - Se não houver createdAt ou validade, retorna o campo status ou 'EM ABERTO'
// - Calcula expiry = createdAt + validade (meses)
// - Se agora > expiry -> 'PENDENTE'
// - Se faltar menos ou igual que thresholdDays para expiry -> 'PRÓX DO VENCIMENTO'
// - Senão -> 'EM ABERTO'

export function computeStatus(record, thresholdDays = 30) {
  if (!record) return "EM ABERTO";

  if (String(record.status)?.toUpperCase() === "CONCLUIDO") return "CONCLUIDO";

  const createdAt = record.createdAt ? new Date(record.createdAt) : null;
  const validadeMonths = record.validade !== undefined && record.validade !== null ? Number(record.validade) : null;

  if (!createdAt || !validadeMonths || isNaN(validadeMonths)) {
    return record.status || "EM ABERTO";
  }

  const expiry = new Date(createdAt);
  expiry.setMonth(expiry.getMonth() + validadeMonths);

  const now = new Date();

  if (now > expiry) return "PENDENTE";

  const diffMs = expiry - now;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= thresholdDays) return "PRÓX DO VENCIMENTO";

  return "EM ABERTO";
}

export default computeStatus;
