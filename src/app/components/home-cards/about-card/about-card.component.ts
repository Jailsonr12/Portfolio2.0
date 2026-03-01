import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-about-card',
  templateUrl: './about-card.component.html',
})
export class AboutCardComponent {
  @Input() badge = '';
  @Input() headline = '';
  @Input() summary = '';
  @Input() badges: Array<{ label: string; value: string }> = [];
  @Input() showTitle = true;
  @Input() showSummary = true;
  @Input() showBadges = true;
  @Input() titleAlign: 'left' | 'center' | 'right' = 'center';
  @Input() textAlign: 'left' | 'center' | 'right' = 'center';
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
