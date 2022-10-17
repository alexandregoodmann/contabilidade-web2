export interface AnaliseDTO {
    idLancamento: number;
    ano: number;
    planilha: string;
    mes: number;
    banco: string;
    tipo: string;
    categoria: string;
    analisar: boolean;
    data: Date;
    descricao: string;
    valor: number;
    fixo: boolean;
    concluido: boolean;
}