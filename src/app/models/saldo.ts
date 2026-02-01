export interface SaldoContas {
    conta: string;
    saldo: number;
    previsto: number;
}

export class Saldos {
    entradas: number = 0;
    saidas: number = 0;
    saldoAtual: number = 0;
    saldoPrevisto: number = 0;
}