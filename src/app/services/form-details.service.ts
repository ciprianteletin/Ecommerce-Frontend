import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDetailsService {

  constructor() {
  }

  getCreditCardMonths(startMonth: number): number[] {
    const data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
        data.push(month);
    }
    return data;
  }

  getCreditCardYears(): number[] {
    const data: number[] = [];

    const startYear: number = new Date().getFullYear();
    for (let year = startYear; year <= startYear + 10; year++) {
      data.push(year);
    }
    return data;
  }
}
