import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../services/login.service';
import {ToastrModule, ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ToastrModule
  ],
  providers: [LoginService],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;


  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: () => this.toastr.success("Login feito com sucesso"),
      error: () => this.toastr.error("Algo deu errado, verifique seu email e senha"),
    });

  }
}
