import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Conta } from '../models/conta';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ContaService extends BasicCrudService<Conta> {

  constructor(private http: HttpClient) {
    super(`${environment.url}/contas`, http);
  }

}
