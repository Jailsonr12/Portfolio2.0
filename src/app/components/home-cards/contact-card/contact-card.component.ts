import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioContactData, PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
})
export class ContactCardComponent {
  @Input() contact!: PortfolioContactData;
  @Input() showEmail = true;
  @Input() showLinkedin = true;
  @Input() showGithub = true;
  @Input() showPhone = true;
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();
}
