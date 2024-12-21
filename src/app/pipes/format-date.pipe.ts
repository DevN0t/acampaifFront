import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return ''; // Verifica se é nulo ou indefinido
    const stringValue = value.toString(); // Converte qualquer tipo para string
    const cleanDate = stringValue.replace(/,/g, ''); // Remove vírgulas, se houver

    if (cleanDate.length < 8){
      let day = cleanDate.slice(5, 6);
      day = '0' + day;
      let month = cleanDate.slice(4, 5);
      month = '0' + month;
      let year = cleanDate.slice(0, 4);
      return `${day}/${month}/${year}`;
    }
    const day = cleanDate.slice(6, 8);
    const month = cleanDate.slice(4, 6);
    const year = cleanDate.slice(0, 4);
    return `${day}/${month}/${year}`;
  }
}
