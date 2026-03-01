import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField, PortfolioProject } from '../../../models/portfolio-data.model';

interface ShowcaseProject {
  title: string;
  description: string;
  technology: string;
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
}

@Component({
  selector: 'app-projects-card',
  templateUrl: './projects-card.component.html',
})
export class ProjectsCardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() items: PortfolioProject[] = [];
  @Input() showTitle = true;
  @Input() showSubtitle = true;
  @Input() showDescription = true;
  @Input() showTechnology = true;
  @Input() showImages = true;
  @Input() maxVisibleItems = 50;
  @Input() featuredProject?: ShowcaseProject;
  @Input() duoProjects: ShowcaseProject[] = [];
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Input() featuredCustomFields: PortfolioCustomCardField[] = [];
  @Input() duoCustomFields: PortfolioCustomCardField[][] = [];

  @Output() edit = new EventEmitter<void>();
  @Output() editFeatured = new EventEmitter<void>();
  @Output() editDuo = new EventEmitter<number>();
}
