import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCaseStudy, PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-case-studies-card',
  templateUrl: './case-studies-card.component.html',
})
export class CaseStudiesCardComponent {
  @Input() caseStudy!: PortfolioCaseStudy;
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
