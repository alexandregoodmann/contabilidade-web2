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
    descricao: string;
    fixo: string;
    parcelas: string;
    valor: number;
    valores: string;
    vetValores: number[];
}