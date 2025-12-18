import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class AdaptadorPersonalizadoFechas extends NativeDateAdapter {

  override format(date: Date, displayFormat: Object): string {

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const result = to2digit(day) + '/' + to2digit(month) + '/' + year; //formato DD/MM/YYYY
    //const result = year + '/' + to2digit(month) + '/' + to2digit(day);   //formato: YYYY-MM-DD
    return result;
  }
}

export function to2digit(n: number) {
  return ('0' + n).slice(-2).toString();
}
