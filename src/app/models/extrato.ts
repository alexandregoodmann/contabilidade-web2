import { TipoConta } from "./conta";
import { Lancamento } from "./lancamento";

export interface ExtratoDTO {
    id: number;
    banco: string;
    descricao: string;
    expanded: boolean;
    tipo: TipoConta;
    saldoPrevisto: number;
    saldoEfetivado: number;
    lancamentos: Lancamento[];
}