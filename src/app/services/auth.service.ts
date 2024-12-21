import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }


  isExpired(): void {
    let token = localStorage.getItem('auth-token');
    if (!token) {
      return;
    }
    try {
      // Decodifica a parte do payload do token JWT
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Obtém a data de expiração (exp) do payload
      const exp = payload.exp;

      if (!exp) {
        return;
      }

      // Compara o tempo atual com o tempo de expiração
      const currentTime = Math.floor(Date.now() / 1000);
      if ( exp < currentTime){
        localStorage.clear();
      };
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
    }
  }
}
