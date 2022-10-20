import { Conta } from "./conta";

export class Extrato extends Conta {
    expanded!: boolean;
    marcado!: boolean;
    saldoPrevisto!: number;
    saldoEfetivado!: number;
    categoria!: string;
    lancamentos!: LancamentoDTO[];
}

export class LancamentoDTO {
    id!: number;
    categoria!: string;
    data!: Date;
    descricao!: string;
    valor!: number;
    concluido!: boolean;
    analisar!: boolean;
    marcado!: boolean;
    fixo!: boolean;
}