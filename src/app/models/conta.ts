
export class Conta {

    id!: number;
    banco!: string;
    descricao!: string;
    tipo!: TipoContaEnum;
    carga!: CargaEnum;

    public constructor(init?: Partial<Conta>) {
        Object.assign(this, init);
    }
}

export enum TipoContaEnum {
    CC, CARTAO, CARTEIRA, REFEICAO, ALIMENTACAO
}

export enum CargaEnum {
    BRADESCO, C6
}