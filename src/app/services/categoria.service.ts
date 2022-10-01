import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria } from '../models/categoria';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BasicCrudService<Categoria> {

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/categorias`);
  }


}
