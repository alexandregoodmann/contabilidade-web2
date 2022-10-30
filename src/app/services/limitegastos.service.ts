import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LimiteGastos } from '../models/limitegastos';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class LimitegastosService extends BasicCrudService<LimiteGastos> {

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/limitegastos`);
  }

}
