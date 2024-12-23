import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {EventsService} from '../../services/events.service';
import {EventsResponse} from '../../types/events-response-type';
import {NgForOf, NgIf} from '@angular/common';
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
    FormatDatePipe],
  providers: [
    provideNgxMask(), // Provedor necessário para configurar o ngx-mask
  ],
  templateUrl: './campists.component.html',
  standalone: true,
  styleUrl: './campists.component.css'
})
export class CampistsComponent implements OnInit {
  events: EventsResponse[] = [];
  campists: CampistsResponseType[] = [];
  filteredCampists: CampistsResponseType[] = [];
  selectedEventId: number | null = null;
  searchTerm: string = '';
  campistForm: FormGroup;
  itemsPerPage = 7;
  currentPage = 1;
  totalPages = 1;

  selectedId = 0;

  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private eventService: EventsService,
    private campistsService: CampistsService,
    private router: Router
  ) {
    this.campistForm = this.initForm();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  getDisplayedPages(): number[] {
    const pages: number[] = [];

    // Sempre exibir no máximo 5 botões de páginas
    const maxVisiblePages = 3;

    // Cálculo do range de páginas
    const halfRange = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.currentPage - halfRange);
    let end = Math.min(this.totalPages, this.currentPage + halfRange);

    // Ajustar o range se estiver próximo ao início ou final
    if (this.currentPage <= halfRange) {
      end = Math.min(this.totalPages, maxVisiblePages);
    } else if (this.currentPage + halfRange >= this.totalPages) {
      start = Math.max(1, this.totalPages - maxVisiblePages + 1);
    }

    // Adicionar as páginas ao array
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }


  trackByPage(index: number, page: number): number {
    return page;
  }

  // Inicialização do Formulário
  private initForm(): FormGroup {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      church: new FormControl('', [Validators.required]),
      birthDate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      phoneEmergency: new FormControl('', [Validators.required])
    });
  }

  // Carrega os eventos ao iniciar
  private loadEvents(): void {
    this.eventService.events().subscribe((value) => {
      this.events = value;
      if (this.events.length > 0) {
        this.selectedEventId = this.events[0].id;
        this.loadCampists();
      }
    });
  }

  // Atualiza lista de campistas ao selecionar evento
  onEventSelected(event: Event): void {
    const selectedId = (event.target as HTMLSelectElement).value;
    if (selectedId) {
      this.selectedEventId = Number(selectedId);
      this.loadCampists();
    }
  }

  // Carrega os campistas para o evento selecionado
  private loadCampists(): void {
    if (this.selectedEventId != null) {
      this.campistsService.campists(this.selectedEventId).subscribe((value) => {
        this.campists = value;
        this.filterCampists();
      });
    }
  }

  // Filtro por termo de pesquisa
  filterCampists(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    const allFilteredCampists = this.campists.filter((campist) =>
      campist.name.toLowerCase().includes(searchTermLower) ||
      campist.church.toLowerCase().includes(searchTermLower) ||
      campist.birthDate.toString().toLowerCase().includes(searchTermLower)
    );

    this.totalPages = Math.ceil(allFilteredCampists.length / this.itemsPerPage);
    this.setPage(this.currentPage, allFilteredCampists);
  }

  // Submissão do Formulário
  submit(): void {
    if (this.selectedEventId) {
      this.campistsService.campistsCreate(
        this.selectedEventId,
        this.campistForm.value.name,
        this.campistForm.value.church,
        this.campistForm.value.birthDate,
        this.campistForm.value.email,
        this.campistForm.value.phone,
        this.campistForm.value.phoneEmergency
      ).subscribe(() => {
        this.campistForm.reset();
        this.loadCampists();
      }, error => {
        console.error('Erro ao criar campista:', error);
      });
    }
  }

  // Paginação
  setPage(page: number, campistsList: CampistsResponseType[] = this.campists): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredCampists = campistsList.slice(startIndex, endIndex);
  }

  // Foco no Input de Pesquisa
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.focusSearchInput();
    }
  }

  focusSearchInput(): void {
    this.searchInput.nativeElement.focus();
  }

  // Navegação para QR Code
  navigateToQrCode(): void {
    if (this.selectedEventId) {
      this.router.navigate(['/qr-code'], { queryParams: { eventId: this.selectedEventId } });
    }
  }

  findCampist(id: number) {
    return this.campistsService.campist(id).subscribe((value) => {
      this.selectedId = id;
      const formattedBirthDate = this.transform(value.birthDate.toString());

      this.campistForm.patchValue({
        name: value.name,
        church: value.church,
        birthDate: formattedBirthDate,
        email: value.email,
        phone: value.phone,
        phoneEmergency: value.phoneEmergency
      });
    });
  }



  transform(value: any): string {
    if (!value) return ''; // Verifica se é nulo ou indefinido
    const stringValue = value.toString(); // Converte qualquer tipo para string
    const cleanDate = stringValue.replace(/,/g, ''); // Remove vírgulas, se houver

    if (cleanDate.length < 8){
      let day = cleanDate.slice(5, 6);
      day = '0' + day;
      let month = cleanDate.slice(4, 5);
      month = '0' + month;
      let year = cleanDate.slice(0, 4);
      return `${day}/${month}/${year}`;
    }
    const day = cleanDate.slice(6, 8);
    const month = cleanDate.slice(4, 6);
    const year = cleanDate.slice(0, 4);
    return `${day}/${month}/${year}`;
  }

  submitEdit() {
    if (this.selectedEventId) {

      this.campistsService.campistsUpdate(
        this.selectedId,
        this.selectedEventId,
        this.campistForm.value.name,
        this.campistForm.value.church,
        this.campistForm.value.birthDate,
        this.campistForm.value.email,
        this.campistForm.value.phone,
        this.campistForm.value.phoneEmergency
      ).subscribe(() => {
        this.campistForm.reset();
        this.loadCampists();
      }, error => {
        console.error('Erro ao criar campista:', error);
      });
    }
  }

  deleteCampist() {
    this.campistsService.deleteCampist(this.selectedId).subscribe(() => {
      this.loadCampists();
    });
  }

  selectItem(id: number) {
    this.selectedId = id;

  }
}
