import { Categoria } from "./categoria";
import { Planilha } from "./planilha";

export class LimiteGastos {
    id!: number;
    categoria!: Categoria;
    planilha!: Planilha;
    limite!: number;
}