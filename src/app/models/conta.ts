
export class Conta {
    id?: number;
    banco?: string;
    descricao?: string;
    carga?: CargaEnum;
    tipo?: TipoContaEnum;
}

export enum TipoContaEnum {
    CC, CARTAO, CARTEIRA, REFEICAO, ALIMENTACAO
}

export enum CargaEnum {
    BRADESCO, C6
}