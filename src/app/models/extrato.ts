import { LancamentoDTO } from "./lancamentoDTO";

export interface ExtratoDTO {
    id: number;
    banco: string;
    descricao: string;
    expanded: boolean;
    marcado: boolean;
    saldoPrevisto: number;
    saldoEfetivado: number;
    categoria: string;
    lancamentos: LancamentoDTO[];
}