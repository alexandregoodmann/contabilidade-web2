export interface AnaliseCategoria {
    descricao: string;
    soma: number;
    porcentagem: number;
    limite: number;
}

export interface PlanilhaAnual {
    id: number;
    data: Date;
    conta: string;
    tipoConta: string;
    descricao: string;
    tipoLancamento: string;
    fixo: string;
    parcelas: string;
    listValores: number[];
}