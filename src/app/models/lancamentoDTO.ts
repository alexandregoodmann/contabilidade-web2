export interface LancamentoDTO {
    id: number;
    categoria: string;
    data: Date;
    descricao: string;
    valor: number;
    concluido: boolean;
    analisar: boolean;
    marcado: boolean;
    fixo: boolean;
}