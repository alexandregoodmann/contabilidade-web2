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
    marcado!: boolean;
}
