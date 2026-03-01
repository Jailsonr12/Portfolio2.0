import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField, PortfolioProfileData } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-github-profile-card',
  templateUrl: './github-profile-card.component.html',
})
export class GithubProfileCardComponent {
  @Input() profile!: PortfolioProfileData;
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Input() linkedinUrl = '';
  @Input() linkedinHeadline = '';
  @Input() linkedinActivity = '';
  @Input() linkedinExperience = '';
  @Input() showLinkedinLink = true;
  @Input() showLinkedinExtras = true;
  @Input() showLinkedinIcon = true;
  @Output() edit = new EventEmitter<void>();
}
