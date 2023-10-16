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
export class AnaliseService {

  private extratoBehavior = new BehaviorSubject<Array<Lancamento>>(new Array<Lancamento>());
  extratoObservable = this.extratoBehavior.asObservable();

  private extratoDataSource!: Lancamento[];

  constructor(
    private http: HttpClient,
    private planilhaService: PlanilhaService
  ) { }

  getAnaliseCategoria(ano: number, mes: number): Observable<AnaliseCategoria[]> {
    return this.http.get<AnaliseCategoria[]>(`${environment.url}/analise/categoria/${ano}/${mes}`);
  }

  getResumoExtrato(ano: number, mes: number): Observable<ResumoExtrato[]> {
    return this.http.get<ResumoExtrato[]>(`${environment.url}/analise/resumoextrato/${ano}/${mes}`);
  }

  getExtrato(setBehavior: boolean) {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getLancamentos(planilha.id).subscribe(lancamentos => {
        this.extratoDataSource = lancamentos;
        if (setBehavior)
          this.extratoBehavior.next(this.extratoDataSource);
      });
    });
  }

  filtrarExtratoPorCategoria(label?: string) {
    this.getExtrato(false);
    this.extratoDataSource.forEach(conta => {
      if (label == undefined) {
        // conta.lancamentos = conta.lancamentos.filter(l => l.labels.length == 0);
      } else {
        // conta.lancamentos = conta.lancamentos.filter(l => l.labels.includes(label));
      }
    });
    //this.extratoDataSource = this.extratoDataSource.filter(e => e.lancamentos.length > 0);
    this.extratoBehavior.next(this.extratoDataSource);
  }

}

