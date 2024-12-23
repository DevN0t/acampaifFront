import {Component, OnInit} from '@angular/core';
import QRCode from 'qrcode';
import {CampistsService} from '../../services/campists.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  standalone: true,
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent implements OnInit{
  private selectedEventId: number | null = null;

  private code = '';
  copiado: boolean = false;
  isLoading = true;


  constructor(private campistsService: CampistsService, private route: ActivatedRoute) {
  }
  ngOnInit() {
    const container = document.getElementById('qrcode-container');

    this.route.queryParams.subscribe((params) => {
      this.selectedEventId = params['eventId'];
    });

    if (container) {
      container.innerHTML = ''; // Limpa o container antes de adicionar um novo QR Code

      const canvas = document.createElement('canvas'); // Cria um elemento <canvas>
      container.appendChild(canvas); // Adiciona o <canvas> ao container

       this.code = 'aaaaaaaaaaaaaaaaa';

      if (this.selectedEventId != null) {
        this.campistsService.campistsQr(this.selectedEventId).subscribe((data) => {
          this.code = data.code;
          this.isLoading = false;
          QRCode.toCanvas(canvas, "https://acampaiweb.squareweb.app/campistas/cadastro/"+this.code, {
            width: 400,
            margin: 0
          }, (error) => {
            if (error) {
              console.error('Erro ao gerar QR Code:', error);
            }
          });
        });
      }
    }
  }


  copiarTexto(): void {
    // Copiar o texto usando a Clipboard API moderna
    navigator.clipboard.writeText("https://acampaiweb.squareweb.app/campistas/cadastro/"+this.code)
      .then(() => {
        // Se a cópia for bem-sucedida
        this.copiado = true;
        setTimeout(() => {
          this.copiado = false;
        }, 2000); // Esconde a mensagem após 2 segundos
      })
      .catch(err => {
        // Se ocorrer um erro na cópia
        console.error('Erro ao copiar: ', err);
      });
  }
}
