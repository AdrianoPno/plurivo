export type TipoVinculo = "COOP" | "RPA";
export type StatusCooperado = "ATIVO" | "INATIVO" | "PENDENTE";
export type Sexo = "Masculino" | "Feminino" | "Outro";

/**
 * @openapi
 * components:
 *   schemas:
 *     ICooperado:
 *       type: object
 *       required:
 *         - ID_COOPERADO
 *         - nome
 *         - cpf
 *         - dataNascimento
 *         - sexo
 *         - etnia
 *         - escolaridade
 *         - cargo
 *         - tipoVinculo
 *         - dataEntrada
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: ID do documento gerado pelo Firestore.
 *           readOnly: true
 *         ID_COOPERADO:
 *           type: string
 *           description: Matrícula ou ID interno operacional do cooperado.
 *         nome:
 *           type: string
 *         cpf:
 *           type: string
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Formato YYYY-MM-DD.
 *         sexo:
 *           type: string
 *           enum: [Masculino, Feminino, Outro]
 *         etnia:
 *           type: string
 *         escolaridade:
 *           type: string
 *         cargo:
 *           type: string
 *         tipoVinculo:
 *           type: string
 *           enum: [COOP, RPA]
 *         dataEntrada:
 *           type: string
 *           format: date
 *           description: Formato YYYY-MM-DD.
 *         dataSaida:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Formato YYYY-MM-DD.
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, PENDENTE]
 *         unidadeId:
 *           type: string
 *           description: Chave de isolamento (Multi-tenant), preenchida automaticamente.
 *           readOnly: true
 *         criadoEm:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         atualizadoEm:
 *           type: string
 *           format: date-time
 *           readOnly: true
 */
export interface ICooperado {
  id?: string; // ID gerado pelo Firestore
  ID_COOPERADO: string; // Matrícula ou ID interno operacional
  nome: string;
  cpf: string;
  dataNascimento: string; // Formato ISO (YYYY-MM-DD)
  sexo: Sexo;
  etnia: string;
  escolaridade: string;
  cargo: string;
  tipoVinculo: TipoVinculo;
  dataEntrada: string; // Formato ISO
  dataSaida?: string | null;
  status: StatusCooperado;
  unidadeId: string; // Chave de isolamento (Multi-tenant)
  criadoEm: Date;
  atualizadoEm: Date;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCooperadoDTO:
 *       type: object
 *       description: Dados para criação de um novo cooperado. O campo 'unidadeId' é inferido a partir do usuário autenticado.
 *       required:
 *         - ID_COOPERADO
 *         - nome
 *         - cpf
 *         - dataNascimento
 *         - sexo
 *         - etnia
 *         - escolaridade
 *         - cargo
 *         - tipoVinculo
 *         - dataEntrada
 *         - status
 *       properties:
 *         ID_COOPERADO:
 *           type: string
 *         nome:
 *           type: string
 *         cpf:
 *           type: string
 *         dataNascimento:
 *           type: string
 *           format: date
 *         sexo:
 *           type: string
 *           enum: [Masculino, Feminino, Outro]
 *         etnia:
 *           type: string
 *         escolaridade:
 *           type: string
 *         cargo:
 *           type: string
 *         tipoVinculo:
 *           type: string
 *           enum: [COOP, RPA]
 *         dataEntrada:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO, PENDENTE]
 *         unidadeId:
 *           type: string
 *           description: ID da unidade. Obrigatório se o requisitante for SUPER.
 */
export interface ICreateCooperadoDTO extends Omit<
  ICooperado,
  "id" | "unidadeId" | "criadoEm" | "atualizadoEm"
> {
  unidadeId?: string;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateCooperadoDTO:
 *       type: object
 *       description: Dados para atualização de um cooperado. Todos os campos são opcionais.
 *       properties:
 *         ID_COOPERADO:
 *           type: string
 *         nome:
 *           type: string
 *         cpf:
 *           type: string
 *         dataNascimento:
 *           type: string
 *           format: date
 *         sexo:
 *           type: string
 *           enum: [Masculino, Feminino, Outro]
 *         etnia:
 *           type: string
 *         escolaridade:
 *           type: string
 *         cargo:
 *           type: string
 *         tipoVinculo:
 *           type: string
 *           enum: [COOP, RPA]
 *         dataEntrada:
 *           type: string
 *           format: date
 *         dataSaida:
 *           type: string
 *           format: date
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ATIVO, INATIVO]
 */
export type IUpdateCooperadoDTO = Partial<ICreateCooperadoDTO>;
