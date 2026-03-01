import { Component, Input } from '@angular/core';
import { PortfolioProject } from '../../models/portfolio-data.model';

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss'],
})
export class ApresentacaoComponent {
  @Input() title = 'Projetos';
  @Input() subtitle = 'Selecao dos trabalhos em destaque';
  @Input() projects: PortfolioProject[] = [];
  @Input() showTitle = true;
  @Input() showSubtitle = true;
  @Input() showDescription = true;
  @Input() showTechnology = true;
  @Input() showImages = true;
  @Input() maxVisibleItems = 50;

  inView = true;

  get visibleProjects(): PortfolioProject[] {
    const max = Number.isFinite(Number(this.maxVisibleItems)) ? Number(this.maxVisibleItems) : 50;
    const safeMax = Math.max(1, max);
    return this.projects.slice(0, safeMax);
  }
}
