import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {FormatDatePipe} from '../../pipes/format-date.pipe';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import {EventsResponse} from '../../types/events-response-type';
import {EventsService} from '../../services/events.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [
    SidebarComponent,
    FormatDatePipe,
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './events.component.html',
  standalone: true,
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{


  events: EventsResponse[] = [];
  filteredEvents: EventsResponse[] = [];
  selectedEventId: number | null = null;
  searchTerm: string = '';  // ID do evento selecionado
  eventForm: FormGroup;

  itemsPerPage: number = 7; // Quantos itens por página
  currentPage: number = 1; // Página atual
  totalPages: number = 1;

  constructor(private eventService: EventsService, private router: Router) {
    this.eventForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
    })
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


  loadEvents(): void {
    this.eventService.events().subscribe((value) => {
      this.events = value;
      console.log('Campistas carregados:', this.events);
      this.filterEvents(); // Filtra campistas após carregar

    });
  }

  filterEvents(): void {
    const searchTermLower = this.searchTerm.toLowerCase();

    const allFilteredEvents = this.events.filter((campist) =>
      campist.name.toLowerCase().includes(searchTermLower)
    );

    // Atualiza a paginação com base nos resultados filtrados
    this.totalPages = Math.ceil(allFilteredEvents.length / this.itemsPerPage);
    this.setPage(this.currentPage, allFilteredEvents);
  }

  submit(): void {
    this.eventService.eventCreate(
      this.eventForm.value.name,
      this.eventForm.value.date
    ).subscribe(
      () => {
        console.log('Evento criado com sucesso!');
        this.eventForm.reset(); // Reseta o formulário após o envio
        this.loadEvents(); // Atualiza a lista de eventos
      },
      (error) => {
        console.error('Erro ao criar evento:', error);
      }
    );
  }
  fetchEvents(): void {
    // Simule buscar os dados do backend
      this.eventService.events().subscribe((data) => {
        this.events = data;
        this.updatePagination();
      });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    this.setPage(this.currentPage);
  }

  setPage(page: number, eventsList: EventsResponse[] = this.events): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredEvents = eventsList.slice(startIndex, endIndex);
  }

}
