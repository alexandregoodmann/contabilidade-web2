import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class BasicCrudService<T> {

  private _url;
  private _http: HttpClient;

  constructor(url: string, http: HttpClient) {
    this._url = url;
    this._http = http;
  }

  create(obj: T): Observable<T> {
    return this._http.post<T>(this._url, obj, httpOptions).pipe(
      catchError(this.handleError<T>('create'))
    );
  }

  update(obj: T): Observable<T> {
    return this._http.put<T>(this._url, obj, httpOptions)
      .pipe(
        catchError(this.handleError('update', obj))
      );
  }

  delete(id: number): Observable<any> {
    return this._http.delete(`${this._url}/${id}`, httpOptions)
      .pipe(
        catchError(this.handleError('delete'))
      );
  }

  findById(id: number) {
    return this._http.get<T>(`${this._url}/${id}`);
  }

  findAll(): Observable<Array<T>> {
    return this._http.get<Array<T>>(this._url);
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}

export const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};