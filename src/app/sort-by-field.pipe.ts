import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByField'
})
export class SortByFieldPipe implements PipeTransform {

  transform(list: any[], field: string, descending: boolean = false): any[] {
    return list.slice().sort((a, b) => ((a[field] > b[field]) != descending ? 1 : -1));
  }

}
