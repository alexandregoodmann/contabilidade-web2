import { TipoConta } from "./conta";
import { TipoLancamento } from "./lancamento";

export interface AnaliseDTO {
    idLancamento: number;
    ano: number;
    planilha: string;
    mes: number;
    banco: string;
    tipoLancamento: TipoLancamento;
    tipoConta: TipoConta;
    data: Date;
    descricao: string;
    valor: number;
    fixo: boolean;
    concluido: boolean;
}