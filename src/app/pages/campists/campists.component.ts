import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {EventsService} from '../../services/events.service';
import {EventsResponse} from '../../types/events-response-type';
import {NgForOf} from '@angular/common';
import {CampistsService} from '../../services/campists.service';
import {CampistsResponseType} from '../../types/campists-response-type';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {FormatDatePipe} from '../../pipes/format-date.pipe';
import {Router} from '@angular/router';

@Component({
  selector: 'app-campists',
  imports: [
    SidebarComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    FormatDatePipe
  ],
  providers: [
    provideNgxMask(), // Provedor necessário para configurar o ngx-mask
  ],
  templateUrl: './campists.component.html',
  standalone: true,
  styleUrl: './campists.component.css'
})
export class CampistsComponent implements OnInit{

  events: EventsResponse[] = [];
  campists: CampistsResponseType[] = [];
  filteredCampists: CampistsResponseType[] = [];
  selectedEventId: number | null = null;
  searchTerm: string = '';  // ID do evento selecionado
  campistForm: FormGroup;

  itemsPerPage: number = 10; // Quantos itens por página
  currentPage: number = 1; // Página atual
  totalPages: number = 1;

  constructor(private eventService: EventsService, private campistsService: CampistsService, private router: Router) {
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
    this.eventService.events().subscribe((value) => {
      this.events = value;

      if (this.events.length > 0) {
        // Define o primeiro evento como selecionado
        this.selectedEventId = this.events[0].id;

        // Carrega os campistas com base no primeiro evento
        this.fetchCampists(); // Método para buscar os campistas
      }
    });
  }

  onEventSelected(event: Event): void {
    // Obtém o ID do evento selecionado
    const selectedId = (event.target as HTMLSelectElement).value;

    if (selectedId) {
      this.selectedEventId = Number(selectedId);
      this.loadCampists(this.selectedEventId);
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault(); // Impede comportamentos padrão
      this.focusSearchInput();
    }
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  @ViewChild('searchInput') searchInput!: ElementRef;


  loadCampists(eventId: number): void {
    this.campistsService.campists(eventId).subscribe((value) => {
      this.campists = value;
      console.log('Campistas carregados:', this.campists);
      this.filterCampists(); // Filtra campistas após carregar

    });
  }

  filterCampists(): void {
    const searchTermLower = this.searchTerm.toLowerCase();

    // Filtra os campistas e armazena os resultados em allFilteredCampists
    const allFilteredCampists = this.campists.filter((campist) =>
      campist.name.toLowerCase().includes(searchTermLower) ||
      campist.church.toLowerCase().includes(searchTermLower) ||
      campist.birthDate.toString().toLowerCase().includes(searchTermLower)
    );

    // Atualiza a paginação com base nos resultados filtrados
    this.totalPages = Math.ceil(allFilteredCampists.length / this.itemsPerPage);
    this.setPage(this.currentPage, allFilteredCampists);
  }

  submit() {
    if (this.selectedEventId != null) {
      this.campistsService.campistsCreate(
        this.selectedEventId,
        this.campistForm.value.name,
        this.campistForm.value.church,
        this.campistForm.value.birthDate,
        this.campistForm.value.email,
        this.campistForm.value.phone,
        this.campistForm.value.phoneEmergency
      ).subscribe(() => {
        console.log("Campista criado com sucesso!");
        this.campistForm.reset(); // Opcional: reseta o formulário após o envio
        this.fetchCampists(); // Atualiza a lista de campistas
      }, error => {
        console.error("Erro ao criar campista:", error);
      });
    }
    }
  fetchCampists(): void {
    // Simule buscar os dados do backend
    if (this.selectedEventId != null) {
      this.campistsService.campists(this.selectedEventId).subscribe((data) => {
        this.campists = data;
        this.updatePagination();
      });
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.campists.length / this.itemsPerPage);
    this.setPage(this.currentPage);
  }

  setPage(page: number, campistsList: CampistsResponseType[] = this.campists): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Atualiza filteredCampists com base na lista fornecida
    this.filteredCampists = campistsList.slice(startIndex, endIndex);
  }

  navigateToQrCode() {


      this.router.navigate(['/qr-code'], {
        queryParams: {
          eventId: this.selectedEventId
        }
      });
  }
}
