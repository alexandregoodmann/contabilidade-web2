import { Lancamento } from "./lancamento";

export class Planilha {
    id!: number;
    mes!: number;
    ano!: number;
    descricao!: string;
    lancamentos!: Lancamento[];
}