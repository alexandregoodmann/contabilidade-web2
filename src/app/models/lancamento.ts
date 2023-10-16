import { Conta } from "./conta";
import { Planilha } from "./planilha";

export class Lancamento {
    id!: number;
    conta!: Conta;
    cartao!: Conta;
    planilha!: Planilha;
    data!: Date;
    descricao!: string;
    valor!: number;
    fixo!: string;
    concluido!: boolean;
    numeroBradesco!: boolean;
    tipo!: TipoLancamento;
    parcelas!: string;
    marcado!: boolean;
    labels!: string[];
}

export enum TipoLancamento {
    SALDO = 'SALDO', FATURA = 'FATURA'
}