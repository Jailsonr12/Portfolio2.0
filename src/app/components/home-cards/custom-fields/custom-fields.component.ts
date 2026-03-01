import { Component, Input } from '@angular/core';
import { PortfolioCustomCardField } from '../../../models/portfolio-data.model';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
})
export class CustomFieldsComponent {
  @Input() fields: PortfolioCustomCardField[] = [];
}
