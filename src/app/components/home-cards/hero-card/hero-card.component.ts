import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PortfolioCustomCardField, PortfolioDocument } from '../../../models/portfolio-data.model';

interface HeroContactLink {
  label: string;
  url: string;
  icon: string;
  iconType: 'emoji' | 'image';
}

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
})
export class HeroCardComponent {
  private readonly fallbackCurriculumUrl =
    'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link';

  @Input() portfolio?: PortfolioDocument;
  @Input() githubProfileEnabled = true;
  @Input() showHeroLinkedin = true;
  @Input() showHeroCurriculum = true;
  @Input() showProfileGithub = true;
  @Input() showProfileX = true;
  @Input() showProfileLinkedin = true;
  @Input() showProfileWebsite = true;
  @Input() customFields: PortfolioCustomCardField[] = [];
  @Output() edit = new EventEmitter<void>();

  get heroCurriculumUrl(): string {
    if (!this.portfolio) {
      return this.fallbackCurriculumUrl;
    }

    const fromCurriculum = this.normalizeCurriculumUrl(this.portfolio.curriculum.url);
    if (fromCurriculum) {
      return fromCurriculum;
    }

    const fromSocial = this.normalizeCurriculumUrl(this.portfolio.socialLinks.curriculum);
    if (fromSocial) {
      return fromSocial;
    }

    return this.fallbackCurriculumUrl;
  }

  get heroContacts(): HeroContactLink[] {
    if (!this.portfolio) {
      return [];
    }

    const customContacts = (this.portfolio.hero.contacts || [])
      .map<HeroContactLink>((contact) => ({
        label: (contact.label || '').trim() || 'Contato',
        url: this.normalizeContactUrl(contact.url, contact.label || ''),
        icon: (contact.icon || '').trim() || '\u{1F517}',
        iconType: contact.iconType === 'image' ? 'image' : 'emoji',
      }))
      .filter((contact) => Boolean(contact.url));

    const defaults: HeroContactLink[] = [
      {
        label: 'Email',
        url: this.normalizeContactUrl(this.portfolio.contact.email, 'Email'),
        icon: '\u{1F4E7}',
        iconType: 'emoji',
      },
      {
        label: 'LinkedIn',
        url: this.normalizeContactUrl(
          this.portfolio.contact.linkedin || this.portfolio.socialLinks.linkedin,
          'LinkedIn'
        ),
        icon: '\u{1F4BC}',
        iconType: 'emoji',
      },
      {
        label: 'GitHub',
        url: this.normalizeContactUrl(this.portfolio.contact.github || this.portfolio.socialLinks.github, 'GitHub'),
        icon: '\u{1F419}',
        iconType: 'emoji',
      },
    ];

    if (!customContacts.length) {
      return defaults.filter((item) => Boolean(item.url));
    }

    defaults.forEach((item) => {
      const alreadyExists =
        customContacts.some((contact) => contact.label.toLowerCase() === item.label.toLowerCase()) ||
        customContacts.some((contact) => contact.url.toLowerCase() === item.url.toLowerCase());
      if (!alreadyExists && item.url) {
        customContacts.push(item);
      }
    });

    return customContacts;
  }

  private normalizeContactUrl(value: string, label: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '';
    }
    if (/^(https?:\/\/|mailto:|tel:)/i.test(raw)) {
      return raw;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(raw) || /email/i.test(label)) {
      return `mailto:${raw.replace(/^mailto:/i, '')}`;
    }
    if (/github/i.test(label) && /^@?[a-z0-9-]+$/i.test(raw)) {
      return `https://github.com/${raw.replace(/^@/, '')}`;
    }
    if (/linkedin/i.test(label) && /^@?[a-z0-9-]+$/i.test(raw)) {
      return `https://www.linkedin.com/in/${raw.replace(/^@/, '')}`;
    }
    if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return `https://${raw}`;
    }
    return raw;
  }

  private normalizeCurriculumUrl(value: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '';
    }
    if (/^mailto:|^tel:/i.test(raw)) {
      return '';
    }
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return `https://${raw}`;
    }
    return '';
  }
}
