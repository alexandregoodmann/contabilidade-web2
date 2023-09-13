import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Label } from '../models/label';
import { BasicCrudService } from './basic-crud.service';

@Injectable({
  providedIn: 'root'
})
export class LabelService extends BasicCrudService<Label> {

  constructor(private http: HttpClient) {
    super(http, `${environment.url}/labels`);
  }


}
