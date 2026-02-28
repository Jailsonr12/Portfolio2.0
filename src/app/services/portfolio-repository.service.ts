import { Injectable } from '@angular/core';
import { PortfolioDocument } from '../models/portfolio-data.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioRepositoryService {
  private readonly keyPrefix = 'portfolio2.document.';

  get(username: string): PortfolioDocument | null {
    const raw = localStorage.getItem(this.key(username));
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as PortfolioDocument;
    } catch {
      return null;
    }
  }

  save(document: PortfolioDocument): void {
    localStorage.setItem(this.key(document.username), JSON.stringify(document));
  }

  private key(username: string): string {
    return `${this.keyPrefix}${username.toLowerCase()}`;
  }
}
