import { TipoConta } from "./conta";
import { LancamentoDTO } from "./lancamentoDTO";

export interface ExtratoDTO {
    id: number;
    banco: string;
    descricao: string;
    expanded: boolean;
    marcado: boolean;
    tipo: TipoConta;
    saldoPrevisto: number;
    saldoEfetivado: number;
    categoria: string;
    lancamentos: LancamentoDTO[];
}