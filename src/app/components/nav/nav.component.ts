import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  aberto = false;
  curriculo = 'assets/curriculo-jailson-roth.pdf';

  alternar(): void { this.aberto = !this.aberto; }
  fechar(): void { this.aberto = false; }
}
