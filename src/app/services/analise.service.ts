import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnaliseCategoria } from '../models/analise-categoria';
import { ExtratoDTO } from '../models/extrato';
import { PlanilhaService } from './planilha.service';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {

  private extratoBehavior = new BehaviorSubject<Array<ExtratoDTO>>(new Array<ExtratoDTO>());
  extratoObservable = this.extratoBehavior.asObservable();

  private extratoDataSource!: ExtratoDTO[];

  constructor(
    private http: HttpClient,
    private planilhaService: PlanilhaService
  ) { }

  getAnaliseCategoria(ano: number, mes: number): Observable<AnaliseCategoria[]> {
    return this.http.get<AnaliseCategoria[]>(`${environment.url}/analise/categoria/${ano}/${mes}`);
  }

  getExtrato(setBehavior: boolean) {
    this.planilhaService.planilhaSelecionada.subscribe(planilha => {
      this.planilhaService.getExtrato(planilha.id).subscribe(extrato => {
        this.extratoDataSource = extrato;
        if (setBehavior)
          this.extratoBehavior.next(this.extratoDataSource);
      });
    });
  }

  filtrarExtratoPorCategoria(label?: string) {
    this.getExtrato(false);
    this.extratoDataSource.forEach(conta => {
      if (label == undefined) {
        conta.lancamentos = conta.lancamentos.filter(l => l.labels.length == 0);
      } else {
        conta.lancamentos = conta.lancamentos.filter(l => l.labels.includes(label));
      }
    });
    this.extratoDataSource = this.extratoDataSource.filter(e => e.lancamentos.length > 0);
    this.extratoBehavior.next(this.extratoDataSource);
  }

}

