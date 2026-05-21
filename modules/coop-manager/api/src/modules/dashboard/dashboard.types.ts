/**
 * @openapi
 * components:
 *   schemas:
 *     DashboardOverview:
 *       type: object
 *       properties:
 *         totalCooperados:
 *           type: number
 *         complianceRate:
 *           type: number
 *         newCooperadosThisMonth:
 *           type: number
 *     DashboardAlerts:
 *       type: object
 *       properties:
 *         inactivity:
 *           type: number
 *         documentation:
 *           type: number
 *         total:
 *           type: number
 *     DashboardCharts:
 *       type: object
 *       properties:
 *         statusDistribution:
 *           type: object
 *           additionalProperties:
 *             type: number
 *         unitDistribution:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               value:
 *                 type: number
 *         docFunnel:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               COMPLETA:
 *                 type: number
 *               PENDENTE:
 *                 type: number
 *         monthlyGrowth:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *               total:
 *                 type: number
 *     DashboardStats:
 *       type: object
 *       properties:
 *         overview:
 *           $ref: '#/components/schemas/DashboardOverview'
 *         alerts:
 *           $ref: '#/components/schemas/DashboardAlerts'
 *         charts:
 *           $ref: '#/components/schemas/DashboardCharts'
 *         lastUpdate:
 *           type: string
 *           format: date-time
 */
export interface IDashboardStats {
  overview: {
    totalCooperados: number;
    complianceRate: number;
    newCooperadosThisMonth: number;
  };
  alerts: {
    inactivity: number;
    documentation: number;
    total: number;
  };
  charts: {
    statusDistribution: Record<string, number>;
    unitDistribution: Array<{ name: string; value: number }>;
    docFunnel: Array<{ name: string; COMPLETA: number; PENDENTE: number }>;
    monthlyGrowth: Array<{ month: string; total: number }>;
  };
  lastUpdate: string;
}
