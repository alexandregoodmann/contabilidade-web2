import { Injectable } from '@angular/core';
import { BasicCrudService } from './basic-crud.service';
import { Categoria } from '../model/categoria';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BasicCrudService<Categoria> {

  constructor(private http: HttpClient) {
    super(`${environment.url}/categorias`, http);
  }

}
