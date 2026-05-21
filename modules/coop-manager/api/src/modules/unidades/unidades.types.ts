export type UnidadeStatus = "ATIVO" | "INATIVO";

/**
 * @openapi
 * components:
 *   schemas:
 *     UnidadeStatus:
 *       type: string
 *       enum: [ATIVO, INATIVO]
 *       default: "ATIVO"
 *     IUnidade:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID do documento no Firestore.
 *           readOnly: true
 *           example: "yS9sZ5aX5aY9sZ5aX5aY"
 *         nome:
 *           type: string
 *           example: "Guaxupé"
 *         sigla:
 *           type: string
 *           example: "gxp"
 *         status:
 *           $ref: '#/components/schemas/UnidadeStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 */
export interface IUnidade {
  id: string;
  nome: string;
  sigla: string;
  status: UnidadeStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUnidadeDTO:
 *       type: object
 *       description: Dados para criação de uma nova unidade.
 *       required:
 *         - nome
 *         - sigla
 *       properties:
 *         nome:
 *           type: string
 *           example: "Guaxupé"
 *         sigla:
 *           type: string
 *           example: "gxp"
 *         status:
 *           $ref: '#/components/schemas/UnidadeStatus'
 */
export interface ICreateUnidadeDTO {
  nome: string;
  sigla: string;
  status?: UnidadeStatus;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateUnidadeDTO:
 *       type: object
 *       description: Dados para atualização de uma unidade. Todos os campos são opcionais.
 *       properties:
 *         nome:
 *           type: string
 *           example: "Unidade de Guaxupé"
 *         sigla:
 *           type: string
 *           example: "gxp"
 *         status:
 *           $ref: '#/components/schemas/UnidadeStatus'
 */
export type IUpdateUnidadeDTO = Partial<ICreateUnidadeDTO>;
