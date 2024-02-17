export interface AnaliseCategoria {
    descricao: string;
    soma: number;
    porcentagem: number;
    limite: number;
}

export class PlanilhaAnual {
    id!: number;
    idLancamento!: number;
    titulo!: string;
    data!: Date;
    conta!: string;
    descricao!: string;
    fixo!: string;
    parcelas!: string | null;
    tipoConta!: string;
    tipoLancamento!: string;
    valor!: number;
    listValores!: number[];
    mes!: number;
}