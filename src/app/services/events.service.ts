import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {tap} from 'rxjs';
import {EventsResponse} from '../types/events-response-type';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  private url: string = "https://acampaiapi.squareweb.app/";
  branchId? = localStorage.getItem('branchId');

  token? = localStorage.getItem('auth-token');




  events() {
    let headers = new HttpHeaders();

    if (this.token != null) {
      headers = headers.append('Authorization', `Bearer ${this.token}`);
    }
    let branchId = localStorage.getItem('branchId');

    console.log(this.branchId)
    return this.httpClient.get<EventsResponse[]>(this.url + "events?branchId=" + branchId, {headers}).pipe(

      tap(value => {
      })
    );
  }

  eventCreate(name: string, date: string) {

    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    return this.httpClient.post<string>(this.url + "event", {name, date},{headers}).pipe(
      tap(value => {
      })
    );

  }
}
