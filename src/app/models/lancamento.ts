import { Label } from "./label";
import { Conta } from "./conta";
import { Planilha } from "./planilha";

export class Lancamento {
    id!: number;
    conta!: Conta;
    categoria!: Label;
    planilha!: Planilha;
    dtLancamento!: Date;
    descricao!: string;
    valor!: number;
    data!: Date;
    concluido!: boolean;
    fixo!: boolean;
    tipo!: TipoLancamento;
}

export enum TipoLancamento {
    SALDO = 'SALDO', FATURA = 'FATURA'
}