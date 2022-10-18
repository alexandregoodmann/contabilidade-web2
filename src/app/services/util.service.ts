import { Injectable } from '@angular/core';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  sortCollection(s: Sort, collection: any[]) {
    const data = collection.slice();
    const i = (s.direction === 'asc' || s.direction === '') ? 1 : -1;
    return data.sort((a: any, b: any) => {
      a[s.active] = (a[s.active] == null) ? '' : a[s.active];
      b[s.active] = (b[s.active] == null) ? '' : b[s.active];
      if (a[s.active] > b[s.active])
        return 1 * i;
      if (a[s.active] < b[s.active])
        return -1 * i;
      return 0;
    });
  }

}
