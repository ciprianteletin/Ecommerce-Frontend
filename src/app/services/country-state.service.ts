import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {concatMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryStateService {

  constructor(private httpClient: HttpClient) {
  }

  initCountries(): Observable<Country[]> {
    return this.getTokenObservable()
      .pipe(concatMap(token => {
        const bearerToken = token.auth_token;
        return this.httpClient.get<Country[]>('https://www.universal-tutorial.com/api/countries/', {
          headers: new HttpHeaders({
            Authorization: `Bearer ${bearerToken}`,
            Accept: 'application/json'
          })
        });
      }));
  }

  getStates(country: string): Observable<State[]> {
    return this.getTokenObservable()
      .pipe(concatMap(token => {
        const bearerToken = token.auth_token;
        return this.httpClient.get<State[]>(`https://www.universal-tutorial.com/api/states/${country}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${bearerToken}`,
            Accept: 'application/json'
          })
        });
      }));
  }

  getCities(state: string): Observable<City[]> {
    return this.getTokenObservable()
      .pipe(concatMap(token => {
        const bearerToken = token.auth_token;
        return this.httpClient.get<City[]>(`https://www.universal-tutorial.com/api/cities/${state}`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${bearerToken}`,
            Accept: 'application/json'
          })
        });
      }));
  }

  private getTokenObservable(): Observable<any> {
    return this.httpClient.get<any>('https://www.universal-tutorial.com/api/getaccesstoken', {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'api-token': '4UZB7ij2SDryp66-JxYEiWG18HNZGT6hJ0EHDR-ec039Lbdq6ucCQlMr5wWh_nEH3W8',
        'user-email': 'ciprianteletin@yahoo.com'
      })
    });
  }
}

export interface Country {
  country_name: string;
  country_short_name: string;
  country_phone_code: number;
}

export interface State {
  state_name: string;
}

export interface City {
  city_name: string;
}

