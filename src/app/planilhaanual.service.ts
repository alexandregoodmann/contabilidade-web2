import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlanilhaAnual } from './models/analise-categoria';

@Injectable({
  providedIn: 'root'
})
export class PlanilhaanualService {

  constructor(private http: HttpClient) { }

  criarPlanilhaAnual(idPlanilha: number, titulo: string): Observable<PlanilhaAnual> {
    return this.http.post<PlanilhaAnual>(`${environment.url}/planilhaanual/processar/${idPlanilha}/${titulo}`, {});
  }

  getPlanilhaAnualByTitulo(titulo: string): Observable<any> {
    return this.http.get<Array<PlanilhaAnual>>(`${environment.url}/planilhaanual/${titulo}`);
  }

  listPlanilhaAtual(): Observable<any> {
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
  idPlanilha!: string;
  titulo!: string;
  novoTitulo!: string;
}
