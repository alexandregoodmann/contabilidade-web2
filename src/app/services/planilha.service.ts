import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
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
    
    super(`${environment.url}/planilhas/`, http);
    console.log('http', this.http);
  }

  setPlanilhasAno(planilhas: PlanilhasAno[]) {
    this.planilhasAnoB.next(planilhas);
  }

  setPlanilhaSelecionada(planilha: Planilha) {
    this.planilhaSelecionadaB.next(planilha);
  }

  getPlanilha(ano: number, mes: number) {
    return this.http.get<Planilha>(`${environment.url}/planilhas/${ano}/${mes}`);
  }

  getMapa() {
    return this.http.get<Array<PlanilhasAno>>(`${environment.url}/planilhas/mapa`);
  }

  getExtrato(idPlanilha: number) {
    return this.http.get(`${environment.url}/planilhas/${idPlanilha}/extrato`);
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

}
