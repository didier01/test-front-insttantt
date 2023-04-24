import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public baseUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

   public getUserById(idUser: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}user/${idUser}`);
  }
  public postUser(user: UserModel) {
    return this.http.post(`${this.baseUrl}user`, user)
  }

  public updateUser(user: UserModel) {
    return this.http.put(`${this.baseUrl}user/${user.id}`, user)
  }
}
