import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventsService} from '../../services/events.service';
import {CampistsService} from '../../services/campists.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-campists-public',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './campists-public.component.html',
  standalone: true,
  styleUrl: './campists-public.component.css'
})
export class CampistsPublicComponent implements OnInit{

  campistForm: FormGroup;
  codigo: string | null = null;


  constructor(private eventService: EventsService, private campistsService: CampistsService, private router: Router, private route: ActivatedRoute) {
    this.campistForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      church: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      phoneEmergency: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.codigo = this.route.snapshot.paramMap.get('code');
  }

  submit() {
      this.campistsService.campistsCreateQr(
        this.campistForm.value.name,
        this.campistForm.value.church,
        this.campistForm.value.birthDate,
        this.campistForm.value.email,
        this.campistForm.value.phone,
        this.campistForm.value.phoneEmergency,
        this.codigo? this.codigo : ''
      ).subscribe(() => {
        console.log("Campista criado com sucesso!");
        this.campistForm.reset(); // Opcional: reseta o formulário após o envio
      }, error => {
        console.error("Erro ao criar campista:", error);
      });
    }


}
