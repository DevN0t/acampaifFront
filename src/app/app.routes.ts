import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {AuthGuardService} from './services/security/auth-guard.service';
import {CampistsComponent} from './pages/campists/campists.component';
import {EventsComponent} from './pages/events/events.component';
import {QrcodeComponent} from './pages/qrcode/qrcode.component';
import {CampistsPublicComponent} from './pages/campists-public/campists-public.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'acampantes', component: CampistsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'eventos', component: EventsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'qr-code', component: QrcodeComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'campistas/cadastro/:code', component: CampistsPublicComponent
  }
];
