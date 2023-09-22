import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Label } from '../models/label';
import { Lancamento } from '../models/lancamento';
import { BasicCrudService, httpOptions } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService extends BasicCrudService<Lancamento> {

  lancamento!: Lancamento;

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/lancamentos`)
  }

  deleteAll(lancamento_ids: number[]) {
    let dto = { list: lancamento_ids };
    return this.http.post(`${environment.url}/lancamentos/deleteall`, dto, httpOptions).pipe(
      catchError(this.handleError('deleteall'))
    );
  }

  concluir(lancamento_ids: number[]) {
    let dto = { list: lancamento_ids };
    return this.http.post(`${environment.url}/lancamentos/concluir`, dto, httpOptions).pipe(
      catchError(this.handleError('concluir'))
    );
  }

  fixo(lancamento_ids: number[]) {
    let dto = { list: lancamento_ids };
    return this.http.post(`${environment.url}/lancamentos/fixo`, dto, httpOptions).pipe(
      catchError(this.handleError('fixo'))
    );
  }

  categorizar(lancamento_ids: number[], categoria: Label) {
    if (lancamento_ids.length == 0 || categoria == undefined) {
      throw ('ids de lancamentos não informados ou categoria faltando')
    }
    let dto = { list: lancamento_ids, idCategoria: categoria.id };
    return this.http.post(`${environment.url}/lancamentos/categorizar`, dto, httpOptions).pipe(
      catchError(this.handleError('categorizar'))
    );
  }

}