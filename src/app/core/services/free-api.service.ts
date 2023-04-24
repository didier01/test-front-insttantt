import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FreeApiService {

  constructor(private http: HttpClient) { }

  // public getCountries(): Observable<any> {
  //   return this.http.get(`https://restcountries.com/v3.1/all`)
  // }
  public getCountries(): Observable<any> {
    return this.http.get(`https://countriesnow.space/api/v0.1/countries`)
  }

 
}