import { Conta } from "./conta";
import { Label } from "./label";
import { Planilha } from "./planilha";

export class Lancamento {
    id!: number;
    conta!: Conta;
    labels!: Label[];
    planilha!: Planilha;
    dtLancamento!: Date;
    descricao!: string;
    valor!: number;
    data!: Date;
    concluido!: boolean;
    fixo!: boolean;
    tipo!: TipoLancamento;
    analisar!: boolean;
    marcado!: boolean;
}

export enum TipoLancamento {
    SALDO = 'SALDO', FATURA = 'FATURA'
}