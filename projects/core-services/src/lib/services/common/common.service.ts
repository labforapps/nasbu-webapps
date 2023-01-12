import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Country,Occupation } from 'core-models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    @Inject('config') private config: any,
    private httpClient: HttpClient
  ) {}

  getCountries(): Observable<Country[]> {
    const serverUrl: string = `${this.config.serverUrl}/common/countries/`;
    return this.httpClient.get<Country[]>(serverUrl);
  }

   getOccupations(): Observable<Occupation[]> {
    const serverUrl: string = `${this.config.serverUrl}/common/occupations/`;
    return this.httpClient.get<Occupation[]>(serverUrl);
  }
}
