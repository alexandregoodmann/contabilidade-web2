import { Banco } from "./banco";

export class Conta {
    id!: number;
    banco!: Banco;
    descricao!: string;
    tipo!: TipoConta;
}

export enum TipoConta {
    CC, CARTAO
}