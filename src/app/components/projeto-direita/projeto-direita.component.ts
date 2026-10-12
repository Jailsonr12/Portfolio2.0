import { Component, Input } from '@angular/core';
import { Projeto } from '../apresentacao/apresentacao.component';

@Component({
  selector: 'app-projeto-direita',
  templateUrl: './projeto-direita.component.html',
  styleUrls: ['./projeto-direita.component.scss', './projeto-direita.component.responsive.scss']
})
export class ProjetoDireitaComponent {
  @Input() projeto!: Projeto;

  showFullscreen = false;
  fullscreenImageUrl = '';

  openModal(imageUrl: string): void {
    this.showFullscreen = true;
    this.fullscreenImageUrl = imageUrl;
  }

  closeModal(): void {
    this.showFullscreen = false;
  }
}
