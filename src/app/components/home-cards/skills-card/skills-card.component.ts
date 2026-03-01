import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField, PortfolioSkillCategory } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-skills-card',
  templateUrl: './skills-card.component.html',
})
export class SkillsCardComponent {
  @Input() categories: PortfolioSkillCategory[] = [];
  @Input() showTitle = true;
  @Input() showCategories = true;
  @Input() titleAlign: 'left' | 'center' | 'right' = 'center';
  @Input() textAlign: 'left' | 'center' | 'right' = 'center';
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
