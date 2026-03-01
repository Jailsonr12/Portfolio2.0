import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCurriculumData, PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-curriculum-card',
  templateUrl: './curriculum-card.component.html',
})
export class CurriculumCardComponent {
  @Input() curriculum!: PortfolioCurriculumData;
  @Input() fallbackUrl = '';
  @Input() previewImageUrl = '';
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();

  readonly fallbackPreviewImage = './assets/jailsonr12.github.io_portfolio_.png';

  onPreviewError(event: Event): void {
    const target = event.target as HTMLImageElement | null;
    if (!target) {
      return;
    }
    target.src = this.fallbackPreviewImage;
  }
}
