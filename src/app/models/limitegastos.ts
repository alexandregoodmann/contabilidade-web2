import { Label } from "./label";
import { Planilha } from "./planilha";

export class LimiteGastos {
    id!: number;
    categoria!: Label;
    planilha!: Planilha;
    limite!: number;
}