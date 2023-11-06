import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnaliseCategoria } from '../models/analise-categoria';
import { Lancamento } from '../models/lancamento';
import { ResumoExtrato } from '../models/resumo-extrato';
import { PlanilhaService } from './planilha.service';

@Injectable({
  providedIn: 'root'
})
export class ExtratoService {

  datasourceBehavior = new BehaviorSubject<Array<Lancamento>>(new Array<Lancamento>());
  extrato = this.datasourceBehavior.asObservable();
  filtro: any;
  datasource!: Lancamento[];

  constructor(
    private http: HttpClient,
    private planilhaService: PlanilhaService
  ) { }

  updateDatasource() {
    console.log('update');

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

    this.datasourceBehavior.next(data);
  }

  getAnaliseCategoria(ano: number, mes: number): Observable<AnaliseCategoria[]> {
    return this.http.get<AnaliseCategoria[]>(`${environment.url}/analise/categoria/${ano}/${mes}`);
  }

  getResumoExtrato(ano: number, mes: number): Observable<ResumoExtrato[]> {
    return this.http.get<ResumoExtrato[]>(`${environment.url}/analise/resumoextrato/${ano}/${mes}`);
  }

  filtrarExtratoPorCategoria(label: string) {
    let labels = this.datasource.filter(lancamento => lancamento.labels.includes(label));
    this.datasourceBehavior.next(labels);
  }

}
