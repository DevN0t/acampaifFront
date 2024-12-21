import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private router: Router) { }


  navigateToCampists(){
    this.router.navigate(['/acampantes']);
  }

  navigateToEvents(){
    this.router.navigate(['/eventos']);
  }



  logout(){
    localStorage.removeItem('auth-token');
    localStorage.removeItem('branchId');
    this.router.navigate(['/login']);
  }

}
