import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField, PortfolioExperienceEntry } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-experience-card',
  templateUrl: './experience-card.component.html',
})
export class ExperienceCardComponent {
  @Input() entry!: PortfolioExperienceEntry;
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
