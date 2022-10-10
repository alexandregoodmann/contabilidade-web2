import { Row, ChartType } from "angular-google-charts";

export interface AnalisePlanilha {
    mes: number;
    descricao: string;
    qtd: number;
    valor: number;
}

export interface AnaliseSaldoAno {
    mes: string;
    entrada: number;
    saida: number;
    saldo: number;
}

export class ChartDefinition {
    columns!: any[];
    datasource!: any[];
    type!: ChartType;
    width!: number;
    height!: number;
    options!: any;
}