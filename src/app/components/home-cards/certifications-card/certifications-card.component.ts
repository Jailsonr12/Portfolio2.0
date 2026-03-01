import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCertification, PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-certifications-card',
  templateUrl: './certifications-card.component.html',
})
export class CertificationsCardComponent {
  @Input() certifications: PortfolioCertification[] = [];
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
