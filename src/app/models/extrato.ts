import { Conta } from "./conta";
import { Lancamento } from "./lancamento";

export class Extrato extends Conta {
    expanded: boolean = false;
    marcado: boolean = false;
    total: number = 0;
    lancamentos: Lancamento[] = [];
}