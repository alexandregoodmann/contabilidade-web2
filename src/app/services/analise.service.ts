import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnaliseService {

  constructor(private http: HttpClient) { }

  getAnaliseAno(ano: number) {
    return this.http.get(`${environment.url}/analise/${ano}`);
  }

  getAnaliseAnoMes(ano: number, mes: number) {
    return this.http.get(`${environment.url}/analise/${ano}/${mes}`);
  }

}
