export type ResearchStatus = "em_andamento" | "concluida" | "pausada";
export type Methodology =
  | "quantitativa"
  | "qualitativa"
  | "etnografica"
  | "teste_usabilidade";

export interface ResearchProps {
  title: string;
  description: string;
  objective: string;
  status: ResearchStatus;
  methodology: Methodology;

  // Gestão e Métricas
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date | null;
  estimatedCost: number;
  actualCost: number;

  // Contexto e Público
  targetAudience: string;
  location: string;
  tags: string[];

  // Conteúdo
  insights?: string;
  artifacts: string[]; // URLs das fotos/PDFs no Storage

  createdAt?: Date;
  updatedAt?: Date;
}

export class Research {
  public readonly id?: string;
  public readonly props: ResearchProps;

  constructor(props: ResearchProps, id?: string) {
    this.id = id;
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      actualEndDate: props.actualEndDate ?? null,
    };
  }

  // Exemplo de regra de negócio (Sênior): Cálculo de desvio de prazo
  get delayInDays(): number | null {
    if (this.props.status !== "concluida" || !this.props.actualEndDate) {
      return null;
    }
    const diffTime =
      this.props.actualEndDate.getTime() -
      this.props.estimatedEndDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Exemplo de regra de negócio: Saúde financeira da pesquisa
  get isOverBudget(): boolean {
    return this.props.actualCost > this.props.estimatedCost;
  }
}
