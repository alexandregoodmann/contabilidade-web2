import { Conta } from "./conta";
import { Lancamento } from "./lancamento";

export class Extrato extends Conta {
    expanded!: boolean;
    marcado!: boolean;
    total!: number;
    lancamentos!: Lancamento[];
}