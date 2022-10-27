import { CargaEnum, Conta, TipoContaEnum } from "./conta";
import { LancamentoDTO } from "./lancamentoDTO";

export interface ExtratoDTO {
    id: number;
    banco: string;
    descricao: string;
    tipo: TipoContaEnum;
    carga: CargaEnum;
    expanded: boolean;
    marcado: boolean;
    saldoPrevisto: number;
    saldoEfetivado: number;
    categoria: string;
    lancamentos: LancamentoDTO[];
}