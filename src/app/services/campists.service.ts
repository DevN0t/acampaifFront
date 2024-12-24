import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {EventsResponse} from '../types/events-response-type';
import {tap} from 'rxjs';
import {CampistsResponseType} from '../types/campists-response-type';
import {QrCodeResponse} from '../types/QrCode-response-type';
import {CampistsFullResponseType} from '../types/campists-full-response-type';

@Injectable({
  providedIn: 'root'
})
export class CampistsService {

  constructor(private httpClient: HttpClient, private router: Router) { }

  private url: string = "https://acampaiapi.squareweb.app/";
  // private url: string = "http://localhost:8080/";

  token? = localStorage.getItem('auth-token');


  campists(eventId: number) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get<CampistsResponseType[]>(this.url + "campists?eventId=" + eventId, {headers}).pipe(

      tap(value => {
      })
    );
  }

  campistsCreate(eventId: number, name: string, church: string, birthDate: string, email: string, phone: string, phoneEmergency: string) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

     return this.httpClient.post<any>(this.url + "campists",{eventId, name, church, birthDate, email, phone, phoneEmergency} ,{headers}).pipe(
      tap(value => {

      })
    );
  }

  campistsQr(eventId: number) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);
    return this.httpClient.post<QrCodeResponse>(this.url + "campists/qr?eventId="+eventId,{} ,{headers}).pipe(
      tap(value => {}
      ));
  }



  campistsCreateQr(name: string, church: string, birthDate: string, email: string, phone: string, phoneEmergency: string, code: string) {

    return this.httpClient.post<QrCodeResponse>(this.url + "campists/createQr?code="+ code,{name, church, birthDate, email, phone, phoneEmergency}).pipe(
      tap(value => {}
      ));
  }

  campist(id: number) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    return this.httpClient.get<CampistsFullResponseType>(this.url + "campist?id=" + id, {headers}).pipe(
      tap(value => {
    })
    );
  }

  campistsUpdate(id: number, selectedEventId: number, name: string, church: string, birthDate: string, email: string, phone: string, phoneEmergency: string) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    return this.httpClient.put<any>(this.url + "campist?id=" + id, {selectedEventId, name, church, birthDate, email, phone, phoneEmergency},{headers}).pipe(
      tap(value => {
      })
    );
  }

  deleteCampist(id: number) {
    let other_header = new HttpHeaders();
    let token = localStorage.getItem('auth-token');
    let headers = new HttpHeaders();
    headers = other_header.append('Authorization', `Bearer ${token}`);

    return this.httpClient.delete<any>(this.url + "campist?id=" + id,{headers}).pipe(
      tap(value => {
      })
    );
  }
}
