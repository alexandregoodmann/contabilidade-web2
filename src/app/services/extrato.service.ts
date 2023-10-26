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

  datasource!: Lancamento[];

  constructor(
    private http: HttpClient,
    private planilhaService: PlanilhaService
  ) { }

  updateDatasource() {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getLancamentos(planilha.id).subscribe(lancamentos => {
        this.datasource = lancamentos;
        this.datasourceBehavior.next(this.datasource);
      });
    });
  }

  getAnaliseCategoria(ano: number, mes: number): Observable<AnaliseCategoria[]> {
    return this.http.get<AnaliseCategoria[]>(`${environment.url}/analise/categoria/${ano}/${mes}`);
  }

  getResumoExtrato(ano: number, mes: number): Observable<ResumoExtrato[]> {
    return this.http.get<ResumoExtrato[]>(`${environment.url}/analise/resumoextrato/${ano}/${mes}`);
  }

  filtrarPorConta(conta: String) {
    let data = [... new Set(this.datasource.filter(l => l.conta.descricao == conta))].sort();
    this.datasourceBehavior.next(data);
  }


  filtrarExtratoPorCategoria(label?: string) {
    // this.getExtrato(false);
    this.datasource.forEach(conta => {
      if (label == undefined) {
        // conta.lancamentos = conta.lancamentos.filter(l => l.labels.length == 0);
      } else {
        // conta.lancamentos = conta.lancamentos.filter(l => l.labels.includes(label));
      }
    });
    //this.extratoDataSource = this.extratoDataSource.filter(e => e.lancamentos.length > 0);
    this.datasourceBehavior.next(this.datasource);
  }

}

