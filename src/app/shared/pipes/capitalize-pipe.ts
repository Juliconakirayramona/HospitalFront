import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDiagnosis'
})
export class FilterDiagnosisPipe  implements PipeTransform {

 transform(items: any[], searchText: string, keys: string[] = []): any[] {
    if (!items) return [];
    if (!searchText) return items;

    const term = searchText.toLowerCase();

    return items.filter(item => {
      // si no pasas keys, busca en todos los string del objeto
      const fields = keys.length ? keys : Object.keys(item);

      return fields.some(key => {
        const value = item[key];
        return typeof value === 'string' &&
               value.toLowerCase().includes(term);
      });
    });
  }
}
