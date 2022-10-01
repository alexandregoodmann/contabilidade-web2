import { Planilha } from "./planilha";

export class PlanilhasAno {
    ano: number;
    planilhas: Planilha[];
    constructor(ano: number, planilhas: Planilha[]) {
        this.ano = ano;
        this.planilhas = planilhas;
    }
}