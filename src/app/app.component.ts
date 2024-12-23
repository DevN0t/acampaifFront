import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService,     private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.authService.isExpired();
  }
  title = 'untitled1';
}
