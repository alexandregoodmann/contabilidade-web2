import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Banco } from '../models/banco';
import { Conta } from '../models/conta';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService extends BasicCrudService<Conta> {

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/contas`);
  }

  findAllBancos(): Observable<Banco[]> {
    return this.http.get<Banco[]>(`${environment.url}/contas/bancos`)
  }
}
