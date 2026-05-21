import { db } from "../../config/firebase";
import { IUnidade } from "../unidades/unidades.types";
import { UserRole } from "@shared/types/user";

interface ICooperado {
  id: string;
  unidadeId: string;
  status: "ATIVO" | "INATIVO" | "SUSPENSO";
  documentacao?: {
    status: "COMPLETA" | "PENDENTE" | "VENCIDA";
    ultimaVerificacao?: FirebaseFirestore.Timestamp;
  };
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

interface AuthUser {
  uid: string;
  role: UserRole;
  unidadeId?: string;
}

export class DashboardService {
  private db = db;
  private cooperadosCollection = this.db.collection("cooperados");
  private unidadesCollection = this.db.collection("unidades");

  public async getDashboardStats(user: AuthUser) {
    if (!user) throw new Error("Usuário não autenticado.");

    let query: FirebaseFirestore.Query = this.cooperadosCollection;

    // Se NÃO for SUPER, ele OBRIGATORIAMENTE filtra por unidade
    // Isso é mais seguro: na dúvida, restrinja.
    if (user.role !== "SUPER") {
      if (!user.unidadeId) throw new Error("Usuário sem unidade atribuída.");
      query = query.where("unidadeId", "==", user.unidadeId);
    }

    const snapshot = await query.get();
    const cooperados = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ICooperado,
    );

    // --- Cálculos de Data ---
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // --- INDICADORES ---

    // 1. Alertas de Inatividade e Docs
    const inactivityAlerts = cooperados.filter((c) => {
      // Garante que o timestamp exista e seja válido antes de converter
      const date = c.updatedAt?.toDate ? c.updatedAt.toDate() : null;
      return date && date < thirtyDaysAgo;
    }).length;

    const documentationAlerts = cooperados.filter(
      (c) =>
        c.documentacao?.status === "PENDENTE" ||
        c.documentacao?.status === "VENCIDA",
    ).length;

    // 2. Distribuição de Status (Para Gráfico de Pizza)
    const statusDistribution = cooperados.reduce(
      (acc, c) => {
        const s = c.status || "INDEFINIDO";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // 3. Índice de Conformidade (Métrica de Qualidade)
    const totalCooperados = cooperados.length;
    const docsCompletos = cooperados.filter(
      (c) => c.documentacao?.status === "COMPLETA",
    ).length;
    const complianceRate =
      totalCooperados > 0
        ? Math.round((docsCompletos / totalCooperados) * 100)
        : 0;

    // 4. Tendência: Novos membros no mês vs Total
    const newThisMonth = cooperados.filter(
      (c) => c.createdAt?.toDate && c.createdAt.toDate() >= startOfMonth,
    ).length;

    // --- DADOS PARA GRÁFICOS (Apenas para SUPER) ---
    let unitDistribution: { name: string; value: number }[] = [];
    let docFunnel: { name: string; COMPLETA: number; PENDENTE: number }[] = [];
    let monthlyGrowth: { month: string; total: number }[] = [];

    if (user.role === "SUPER") {
      // Busca nomes das unidades para enriquecer os gráficos
      const unidadesSnapshot = await this.unidadesCollection.get();
      const unidadesMap = new Map(
        unidadesSnapshot.docs.map((doc) => [doc.id, doc.data() as IUnidade]),
      );

      // 5. Gráfico de Distribuição por Unidade
      const cooperadosPorUnidade = cooperados.reduce(
        (acc, c) => {
          acc[c.unidadeId] = (acc[c.unidadeId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      unitDistribution = Object.entries(cooperadosPorUnidade).map(
        ([unidadeId, count]) => ({
          name: unidadesMap.get(unidadeId)?.sigla || unidadeId,
          value: count,
        }),
      );

      // 6. Gráfico de Funil de Documentação
      const docsPorUnidade = cooperados.reduce(
        (acc, c) => {
          const sigla = unidadesMap.get(c.unidadeId)?.sigla || c.unidadeId;
          if (!acc[sigla]) acc[sigla] = { COMPLETA: 0, PENDENTE: 0 };
          if (c.documentacao?.status === "COMPLETA") acc[sigla].COMPLETA++;
          if (
            c.documentacao?.status === "PENDENTE" ||
            c.documentacao?.status === "VENCIDA"
          )
            acc[sigla].PENDENTE++;
          return acc;
        },
        {} as Record<string, { COMPLETA: number; PENDENTE: number }>,
      );
      docFunnel = Object.entries(docsPorUnidade).map(([name, values]) => ({
        name,
        ...values,
      }));

      // 7. Gráfico de Crescimento Mensal
      const recentCooperados = cooperados.filter(
        (c) => c.createdAt?.toDate && c.createdAt.toDate() >= sixMonthsAgo,
      );
      const growthByMonth = recentCooperados.reduce(
        (acc, c) => {
          const month = c.createdAt
            .toDate()
            .toLocaleString("default", { month: "short", year: "2-digit" });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      monthlyGrowth = Object.entries(growthByMonth).map(([month, total]) => ({
        month,
        total,
      }));
    }

    return {
      overview: {
        totalCooperados,
        complianceRate,
        newCooperadosThisMonth: newThisMonth,
      },
      alerts: {
        inactivity: inactivityAlerts,
        documentation: documentationAlerts,
        total: inactivityAlerts + documentationAlerts,
      },
      charts: {
        statusDistribution,
        // Dados para SUPER Admin
        unitDistribution: user.role === "SUPER" ? unitDistribution : [],
        docFunnel: user.role === "SUPER" ? docFunnel : [],
        monthlyGrowth: user.role === "SUPER" ? monthlyGrowth : [],
      },
      lastUpdate: now.toISOString(),
    };
  }
}
