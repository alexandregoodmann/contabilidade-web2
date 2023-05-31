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

  agruparCategoria(lancamentos: AnaliseDTO[]): (string | number)[][] {

    let retorno: (string | number)[][] = [];
    let mapaCategorias = new Map<string, number>();

    [...new Set(lancamentos.map(n => n.categoria))].forEach(categoria => {
      let valor = 0;
      lancamentos.filter(o => o.categoria == categoria).forEach(obj => {
        valor = valor + obj.valor;
      });
      mapaCategorias.set(categoria, valor * (-1))
    });

    mapaCategorias.forEach((v, k) => {
      retorno.push([k, v]);
    });

    const data = retorno.sort(function (a, b) {
      if (a[1] > b[1])
        return -1;
      if (a[1] < b[1])
        return 1
      return 0;
    });

    return retorno;
  }

  downloadExtrato(ano: number, mes: number): Observable<Blob> {
    return this.http.get((`${environment.url}/analise/downloadextrato/${ano}/${mes}`), {
      responseType: 'blob'
    });
  }

}
