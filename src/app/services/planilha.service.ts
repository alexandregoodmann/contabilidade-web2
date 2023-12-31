import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlanilhaAnual } from '../models/analise-categoria';
import { Lancamento } from '../models/lancamento';
import { Planilha } from '../models/planilha';
import { PlanilhasAno } from '../models/planilhasano';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class PlanilhaService extends BasicCrudService<Planilha> {

  private planilhasAnoB = new BehaviorSubject<Array<PlanilhasAno>>(new Array<PlanilhasAno>());
  planilhasAno = this.planilhasAnoB.asObservable();

  private planilhaSelecionadaB = new BehaviorSubject<Planilha>(new Planilha());
  planilhaSelecionada = this.planilhaSelecionadaB.asObservable();

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/planilhas`);
  }

  setPlanilhasAno(planilhas: PlanilhasAno[]) {
    this.planilhasAnoB.next(planilhas);
  }

  setPlanilhaSelecionada(planilha: Planilha) {
    this.planilhaSelecionadaB.next(planilha);
  }

  getLancamentos(idPlanilha: number): Observable<Lancamento[]> {
    return this.http.get<Lancamento[]>(`${environment.url}/planilhas/${idPlanilha}/lancamentos`);
  }

  getMapa() {
    return this.http.get<Array<PlanilhasAno>>(`${environment.url}/planilhas/mapa`);
  }

  duplicarPlanilha(idPlanilha: number): Observable<any> {
    return this.http.post(`${environment.url}/planilhas/${idPlanilha}/duplicar`, {});
  }

  criarPlanilhaAnual(idPlanilha: number, titulo: string): Observable<PlanilhaAnual> {
    return this.http.post<PlanilhaAnual>(`${environment.url}/analise/planilhaanual/processar/${idPlanilha}/${titulo}`, {});
  }

  listPlanilhaAtual(): Observable<any> {
    return this.http.get<Array<string>>(`${environment.url}/analise/planilhaanual`);
  }

  getPlanilhaAnualByTitulo(titulo: string): Observable<any> {
    return this.http.get<Array<PlanilhaAnual>>(`${environment.url}/analise/planilhaanual/${titulo}`);
  }

  initPlanilha(planilhas: PlanilhasAno[]): void {
    let retorno!: Planilha;
    let hoje = new Date();
    planilhas.forEach(ano => {
      if (ano.ano == hoje.getFullYear()) {
        ano.planilhas.forEach(planilha => {
          if (planilha.mes == hoje.getMonth() + 1) {
            retorno = planilha;
          }
        });
      }
    });

    if (retorno) {
      this.planilhaSelecionadaB.next(retorno);
    } else {
      let ultima = this.getUltimaPlanilha(planilhas);
      this.planilhaSelecionadaB.next(ultima);
    }
  }

  private getUltimaPlanilha(planilhas: PlanilhasAno[]): Planilha {
    let i = planilhas.length - 1;
    let j = planilhas[i].planilhas.length - 1;
    return planilhas[i].planilhas[j];
  }

  processar(): Observable<any> {
    return this.http.post(`${environment.url}/planilhas/processar`, {});
  }

}
