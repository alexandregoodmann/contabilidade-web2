import { Categoria } from "./categoria";
import { Conta } from "./conta";
import { Planilha } from "./planilha";

export class Lancamento {
    id!: number;
    conta!: Conta;
    categoria!: Categoria;
    planilha!: Planilha;
    dtLancamento!: Date;
    descricao!: string;
    valor!: number;
    data!: Date;
    concluido!: boolean;
    fixo!: boolean;
    tipo!: TipoLancamento;
    repetir!: number;
    hash!: string;
}

export enum TipoLancamento {
    SALDO = 'SALDO', FATURA = 'FATURA', SERIE = 'SERIE'
}