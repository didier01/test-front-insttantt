import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserModel } from '../models/user-model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public baseUrl = environment.API_URL;
  private token: string = '';

  constructor(private http: HttpClient, private router: Router) { 
    this.getStorageToken();
  }


  public registerUser(user: UserModel): Observable<any> {
    return this.http.post(`${this.baseUrl}user`, user).pipe(
      map((resp: any) => {
        this.saveToken(resp['token'], resp['expiresIn']);
        this.saveUserLogged(resp['user']);
        return resp;
      })
    );
  }
  
  public login(user: UserModel): Observable<any> {
    return this.http.post(`${this.baseUrl}auth/login/`, user).pipe(
      map((resp: any) => {
        this.saveToken(resp['token'], resp['expiresIn']);
        this.saveUserLogged(resp['user']);
        return resp;
      })
    );
  }

  public refreshToken(): Observable<any> {
    this.getStorageToken();
    let data = {token: this.token}
    return this.http.post(`${this.baseUrl}auth/refreshToken/`, data).pipe(
      map((resp: any) => {
        this.saveToken(resp['token'], resp['expiresIn']);
        this.saveUserLogged(resp['user']);
        return resp;
      })
    );
  }

  private saveToken(token: string, expiration: any) {
    if (token != null) {
      this.token = token;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('expire', expiration);
    } else {
      this.token = '';
    }
  }

  private saveUserLogged(user: UserModel) {
    sessionStorage.setItem('userLogged', JSON.stringify(user));
  }

  private getStorageToken() {
    if (sessionStorage.getItem('token')) {
      let isToken: any = sessionStorage.getItem('token')!;
      this.token = isToken;
    }
  }

  public isAuthenticated(): boolean {
    this.getStorageToken();

    if (sessionStorage.getItem('token')) {
      if (sessionStorage.getItem('expire')) {
        let expirationDate:any = sessionStorage.getItem('expire')!;
        let today:any = new Date();
        let expiration:any = new Date((expirationDate*1000));
        let diff =  Math.abs(today - expiration);
        let min = Math.floor((diff/1000)/60);
               
        if (today > expiration) {
          return false;
        } 
        
        if (min == 1) {          
          this.refreshToken().subscribe((res:any) => {}, (err:any)=> {});
        }
      }
      return true;
    } else {
      return false;
    }
  }

  public logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expire');
    sessionStorage.removeItem('userLogged');
    this.router.navigateByUrl('auth/login');
  }
}
