import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlanilhaAnual } from './models/analise-categoria';

@Injectable({
  providedIn: 'root'
})
export class PlanilhaanualService {

  planilhasBehavior = new BehaviorSubject<[]>([]);
  planilhas = this.planilhasBehavior.asObservable();

  constructor(private http: HttpClient) { }

  criarPlanilhaAnual(dto: PlanilhaAnualDTO): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/criar`, dto);
  }

  getPlanilhaAnualByTitulo(titulo: string): Observable<any> {
    return this.http.get<Array<PlanilhaAnual>>(`${environment.url}/planilhaanual/${titulo}`);
  }

  findAll(): Observable<any> {
    return this.http.get<Array<string>>(`${environment.url}/planilhaanual`);
  }

  rename(dto: PlanilhaAnualDTO): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/rename`, dto);
  }

  duplicar(planilha: string): Observable<void> {
    return this.http.post<void>(`${environment.url}/planilhaanual/${planilha}/duplicar`, {});
  }

  delete(planilha: string): Observable<void> {
    return this.http.delete<void>(`${environment.url}/planilhaanual/${planilha}`);
  }
}

export class PlanilhaAnualDTO {
  idPlanilha!: number;
  titulo!: string;
  novoTitulo!: string;
}
