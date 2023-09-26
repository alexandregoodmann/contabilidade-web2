import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AnaliseDTO } from '../models/analiseDTO';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {

  constructor(private http: HttpClient) { }

  getAnaliseAno(ano: number): Observable<AnaliseDTO[]> {
    return this.http.get<AnaliseDTO[]>(`${environment.url}/analise/${ano}`);
  }

  getAnaliseAnoMes(ano: number, mes: number): Observable<AnaliseDTO[]> {
    return this.http.get<AnaliseDTO[]>(`${environment.url}/analise/${ano}/${mes}`);
  }

  downloadExtrato(ano: number, mes: number): Observable<Blob> {
    return this.http.get((`${environment.url}/analise/downloadextrato/${ano}/${mes}`), {
      responseType: 'blob'
    });
  }

}
