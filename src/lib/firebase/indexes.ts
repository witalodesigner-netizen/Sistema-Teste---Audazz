/**
 * DOCUMENTAO DE NDICES COMPOSTOS DO FIRESTORE
 * 
 * Os ndices abaixo so obrigatrios para as consultas de listagem e filtros.
 * Voc pode cri-los manualmente no Firebase Console ou via Firebase CLI 
 * usando o arquivo 'firestore.indexes.json'.
 */

export const FIRESTORE_INDEXES = [
  // --- CLIENTES ---
  {
    collection: "clients",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "deletedAt", order: "ASCENDING" },
      { fieldPath: "status", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" }
    ],
    description: "Listagem de clientes por agncia com filtro de status e ordenao por data."
  },

  // --- PROJETOS ---
  {
    collection: "projects",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "deletedAt", order: "ASCENDING" },
      { fieldPath: "status", order: "ASCENDING" },
      { fieldPath: "deadline", order: "ASCENDING" }
    ],
    description: "Kanban e listagem de projetos ordenados por prazo de entrega."
  },

  // --- APROVAES ---
  {
    collection: "approvals",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "deletedAt", order: "ASCENDING" },
      { fieldPath: "status", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" }
    ],
    description: "Monitoramento de aprovaes pendentes por agncia."
  },

  // --- FINANCEIRO (FATURAS) ---
  {
    collection: "invoices",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "deletedAt", order: "ASCENDING" },
      { fieldPath: "status", order: "ASCENDING" },
      { fieldPath: "dueDate", order: "ASCENDING" }
    ],
    description: "Gesto de faturas e fluxo de caixa por agncia."
  },

  // --- TIMESHEETS (COLLECTION GROUP) ---
  {
    collectionGroup: "timesheets",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "collaboratorId", order: "ASCENDING" },
      { fieldPath: "date", order: "DESCENDING" }
    ],
    description: "Relatrios de horas por colaborador em toda a agncia."
  },

  // --- LOGS DE AUDITORIA ---
  {
    collection: "auditLogs",
    fields: [
      { fieldPath: "agencyId", order: "ASCENDING" },
      { fieldPath: "createdAt", order: "DESCENDING" }
    ],
    description: "Exibio cronolgica dos logs de auditoria."
  }
];
