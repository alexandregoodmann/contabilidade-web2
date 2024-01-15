import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlanilhaAnual } from './models/analise-categoria';
import { BasicCrudService } from './services/basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class PlanilhaanualService extends BasicCrudService<PlanilhaAnual>{

  planilhasBehavior = new BehaviorSubject<string[]>([]);
  planilhas = this.planilhasBehavior.asObservable();

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/planilhaanual`)
  }

  criarPlanilhaAnual(dto: PlanilhaAnualDTO): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/criar`, dto);
  }

  getPlanilhaAnualByTitulo(titulo: string): Observable<any> {
    return this.http.get<Array<PlanilhaAnual>>(`${environment.url}/planilhaanual/planilhaanual/${titulo}`);
  }

  getPlanilhas(): Observable<any> {
    return this.http.get<Array<string>>(`${environment.url}/planilhaanual/planilhas`);
  }

  rename(dto: PlanilhaAnualDTO): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/rename`, dto);
  }

  duplicar(planilha: string): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/${planilha}/duplicar`, {});
  }

  deletePlanilhaAnual(planilha: string): Observable<void> {
    return this.http.delete<void>(`${environment.url}/planilhaanual/planilhaanual/${planilha}`);
  }
}

export class PlanilhaAnualDTO {
  idPlanilha!: number;
  titulo!: string;
  novoTitulo!: string;
}
