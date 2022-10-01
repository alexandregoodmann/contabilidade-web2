import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Categoria } from '../model/categoria';
import { Lancamento } from '../model/lancamento';
import { BasicCrudService, httpOptions } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService extends BasicCrudService<Lancamento> {

  constructor(private http: HttpClient) {
    super(`${environment.url}/lancamentos`, http)
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

  categorizar(lancamento_ids: number[], categoria: Categoria) {
    let dto = { list: lancamento_ids, idCategoria: categoria.id };
    return this.http.post(`${environment.url}/lancamentos/categorizar`, dto, httpOptions).pipe(
      catchError(this.handleError('categorizar'))
    );
  }

}