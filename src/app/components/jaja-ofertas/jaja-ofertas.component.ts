import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type Pagina = 'inicio' | 'privacidade' | 'termos' | 'site' | 'tiktok';

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
  telegram = 'https://t.me/jajaofertas';
  bot = 'https://t.me/jaja_operacao_bot';
  pagina: Pagina;

  // Volta do login do TikTok: o servidor do canal não fica exposto na internet, então a página
  // mostra a mensagem pronta e o dono manda ao bot de operação.
  mensagemDoBot = '';
  erroDoTikTok = '';
  copiado = false;

  constructor(rota: ActivatedRoute) {
    this.pagina = (rota.snapshot.data['pagina'] as Pagina) ?? 'inicio';
    if (this.pagina === 'tiktok') {
      const q = rota.snapshot.queryParamMap;
      const codigo = q.get('code') ?? '';
      const state = q.get('state') ?? '';
      if (codigo && state) {
        this.mensagemDoBot = `/conectar ${codigo} ${state}`;
      } else {
        this.erroDoTikTok = q.get('error_description') || q.get('error') || 'O TikTok não mandou o código.';
      }
    }
  }

  copiar(): void {
    navigator.clipboard?.writeText(this.mensagemDoBot).then(() => (this.copiado = true));
  }
}
