import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginResponse} from '../types/login-response-type';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private router: Router) { }


  private url: string = "https://acampaiapi.squareweb.app/";
  token? = localStorage.getItem('auth-token');
  login(login: string, password: string) {
    return this.httpClient.post<LoginResponse>(this.url + "login", {login, password}).pipe(
      tap(value => {
        localStorage.setItem("auth-token", value.token);
        this.router.navigate([""]);
        this.branchId().subscribe();
      })
    );
  }

  branchId() {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    console.log(headers)
    return this.httpClient.get<Number>(this.url + "branch", {headers}).pipe(
      tap(value => {
        localStorage.setItem("branchId", value.toString());
      })
    );
  }
}
