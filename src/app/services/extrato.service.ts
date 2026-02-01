import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnaliseCategoria } from '../models/analise-categoria';
import { Lancamento } from '../models/lancamento';
import { SaldoContas } from '../models/resumo-extrato';
import { PlanilhaService } from './planilha.service';

@Injectable({
  providedIn: 'root'
})
export class ExtratoService {

  datasourceBehavior = new BehaviorSubject<Array<Lancamento>>(new Array<Lancamento>());
  extrato = this.datasourceBehavior.asObservable();
  filtro: any;
  datasource!: Lancamento[];
  datasourceGraficoLimite: any;

  constructor(
    private http: HttpClient,
    private planilhaService: PlanilhaService
  ) { }

  updateDatasource() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getLancamentos(planilha.id).subscribe(lancamentos => {
        this.datasource = lancamentos;
        this.datasourceBehavior.next(this.datasource);
        this.filtrarExtrato();
      });
    });
  }

  filtrarExtrato() {

    let data = [... new Set(this.datasource)];

    if (this.filtro.conta != null && this.filtro.conta != '')
      data = [...data.filter(l => l.conta.id == this.filtro.conta.id)];

    if (this.filtro.descricao != null && this.filtro.descricao != '')
      data = [...data.filter(l => l.descricao.toLowerCase().includes(this.filtro.descricao))];

    if (this.filtro.semLabel)
      data = [...data.filter(l => l.labels.length == 0)];

    if (this.filtro.fixo)
      data = [...data.filter(l => l.fixo != null)];

    if (this.filtro.concluido)
      data = [...data.filter(l => l.concluido == true)];

    if (this.filtro.label) {
      data = [...data.filter(l => l.labels.includes(this.filtro.label.descricao))];
    }

    this.datasourceBehavior.next(data);
  }

  getAnaliseCategoria(ano: number, mes: number): Observable<AnaliseCategoria[]> {
    return this.http.get<AnaliseCategoria[]>(`${environment.url}/analise/categoria/${ano}/${mes}`);
  }

  getSaldoContas(idPlanilha: number): Observable<SaldoContas[]> {
    return this.http.get<SaldoContas[]>(`${environment.url}/analise/saldocontas/${idPlanilha}`);
  }

  filtrarExtratoPorCategoria(label: string) {
    let labels = this.datasource.filter(lancamento => lancamento.labels.includes(label));
    this.datasourceBehavior.next(labels);
  }

}

export function compare(a: number | string | Date | boolean, b: number | string | Date | boolean, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}