import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-projeto-direita',
  templateUrl: './projeto-direita.component.html',
  styleUrls: ['./projeto-direita.component.scss', './projeto-direita.component.responsive.scss']
})
export class ProjetoDireitaComponent {
  @Input() title: string | undefined;
  @Input() imageUrl: string | undefined;
  @Input() about: string | undefined;
  @Input() technologies: string | undefined;
  @Input() githubLink: string | undefined;
  @Input() pageLink: string | undefined;
  @Input() showDescription = true;
  @Input() showTechnology = true;
  @Input() showImage = true;
  
  isProjectModalOpen = false;

  openProjectModal(): void {
    this.isProjectModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.isProjectModalOpen = false;
    document.body.style.overflow = '';
  }
}
