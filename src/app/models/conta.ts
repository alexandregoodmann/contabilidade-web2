
export class Conta {

    id: number | null | undefined;
    banco: string | null | undefined;
    descricao: string | null | undefined;
    tipo: TipoContaEnum | null | undefined;
    carga: CargaEnum | null | undefined;

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