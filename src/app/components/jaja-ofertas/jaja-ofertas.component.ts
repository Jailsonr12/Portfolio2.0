import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type Pagina = 'inicio' | 'privacidade' | 'termos';

// Páginas públicas do Jajá Ofertas (canal de ofertas no Telegram e TikTok).
// A política de privacidade e os termos são exigidos pelo TikTok para liberar a API de desenvolvedor.
@Component({
  selector: 'app-jaja-ofertas',
  templateUrl: './jaja-ofertas.component.html',
  styleUrls: ['./jaja-ofertas.component.scss']
})
export class JajaOfertasComponent {
  atualizadoEm = '22/11/2026';
  contato = 'contato@jajaestuda.com.br';
  logo = './assets/jaja-ofertas/logo.jpeg';
  pagina: Pagina;

  constructor(rota: ActivatedRoute) {
    this.pagina = (rota.snapshot.data['pagina'] as Pagina) ?? 'inicio';
  }
}
