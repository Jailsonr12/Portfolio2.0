import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { catchError, of } from 'rxjs';
import { GitHubProfileService } from '../../services/github-profile.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss', './hello.component.responsive.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('0.5s ease-out', style({ opacity: 1 }))]),
      transition(':leave', [animate('0.5s ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class HelloComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() iam?: string;
  @Input() subtitleOne?: string;
  @Input() subtitleTwo?: string;
  @Input() git?: string;
  @Input() linkedin?: string;
  @Input() curriculum?: string;
  @Input() profileName?: string;
  @Input() profileBio?: string;
  @Input() profileCompany?: string;
  @Input() profileCompanyUrl?: string;
  @Input() profileLocation?: string;
  @Input() profileTimezone?: string;
  @Input() profileWebsite?: string;
  @Input() profileFollowers?: number;
  @Input() profileFollowing?: number;
  @Input() profileProfessionalLabel?: string;
  @Input() githubHandle?: string;
  @Input() profileX?: string;
  @Input() profileLinkedinUser?: string;
  @Input() profileLinkedinPath?: string;

  private nameIntervalId?: ReturnType<typeof setInterval>;
  private iamIntervalId?: ReturnType<typeof setInterval>;

  constructor(private readonly gitHubProfileService: GitHubProfileService) {}

  nameTitles: Array<string> = ['Jaja', 'Jailson da Silva Roth', 'Jailson Roth', 'Roth Jailson', 'Jailson'];

  aboutMe: Array<string> = [
    'Tenho 23 anos e estou cursando Engenharia de Software',
    'Gosto de anime, manga, videogame, ler e ir para academia',
    'Tenho experiencia de 1 ano como Desenvolvimento Web full-stack.',
    'Atualmente trabalho como QA e DevOps na CloudPark',
    'Conhecimento nas linguagens: Java, TypeScript, Angular, JS e MySQL',
    'Sempre estou em busca de mais conhecimento e aprimoramento',
    'Muito prazer, este e meu portfolio e um pouco sobre mim',
  ];

  ngOnInit(): void {
    this.title = this.title || 'Jailson';
    this.iam = this.iam || 'Muito prazer, este e meu portfolio e um pouco sobre mim';
    this.subtitleOne = this.subtitleOne || 'DESENVOLVEDOR';
    this.subtitleTwo = this.subtitleTwo || 'FULL-STACK';
    this.git = this.git || 'https://github.com/Jailsonr12';
    this.linkedin = this.linkedin || 'https://www.linkedin.com/in/jailsonroth/';
    this.curriculum =
      this.curriculum ||
      'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link';
    this.profileName = this.profileName || 'Jailson Roth';
    this.githubHandle = this.githubHandle || 'Jailsonr12';
    this.profileBio =
      this.profileBio ||
      'Beginner in the world of programming, but very thirsty for knowledge. Knowledge basic in Java, JavaScript, HTML, CSS, C#';
    this.profileProfessionalLabel = this.profileProfessionalLabel || 'Professional Profile';
    this.profileFollowers = this.profileFollowers ?? 39;
    this.profileFollowing = this.profileFollowing ?? 37;
    this.profileCompany = this.profileCompany || '@seniorsistemas';
    this.profileCompanyUrl = this.profileCompanyUrl || 'https://github.com/seniorsistemas';
    this.profileLocation = this.profileLocation || 'Brazil';
    this.profileTimezone = this.profileTimezone || this.getTimezoneLabel();
    this.profileWebsite = this.profileWebsite || 'https://www.jrweb.com.br/';
    this.profileX = this.profileX || '@jaisonroth';
    this.profileLinkedinUser = this.profileLinkedinUser || 'jailsonroth';
    this.profileLinkedinPath = this.profileLinkedinPath || 'in/jailsonroth';

    this.loadGitHubProfile();
    this.changeName();
    this.changeiam();
  }

  ngOnDestroy(): void {
    if (this.nameIntervalId) {
      clearInterval(this.nameIntervalId);
    }

    if (this.iamIntervalId) {
      clearInterval(this.iamIntervalId);
    }
  }

  get githubUsername(): string {
    const fallback = this.githubHandle || (this.title || 'dev').replace(/\s+/g, '').toLowerCase();
    if (!this.git) {
      return fallback;
    }

    const match = this.git.match(/github\.com\/([^/?#]+)/i);
    return match?.[1] || fallback;
  }

  get githubAvatarUrl(): string {
    return `https://github.com/${this.githubUsername}.png`;
  }

  get xUrl(): string {
    if (!this.profileX) {
      return '';
    }

    const handle = this.profileX.replace('@', '').trim();
    return handle ? `https://x.com/${handle}` : '';
  }

  get linkedinUrl(): string {
    const path = (this.profileLinkedinPath || '').trim();
    if (path) {
      return `https://www.linkedin.com/${path.replace(/^\/+/, '')}`;
    }

    const user = (this.profileLinkedinUser || '').trim();
    return user ? `https://www.linkedin.com/in/${user.replace(/^@/, '')}` : '';
  }

  get githubLabel(): string {
    if (!this.git) {
      return 'github.com';
    }

    return this.git.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  get xLabel(): string {
    return this.profileX || 'x.com';
  }

  get linkedinLabel(): string {
    const path = (this.profileLinkedinPath || '').trim();
    if (path) {
      return `linkedin.com/${path.replace(/^\/+/, '')}`;
    }

    const user = (this.profileLinkedinUser || '').trim().replace(/^@/, '');
    return user ? `linkedin.com/in/${user}` : 'linkedin.com';
  }

  get websiteLabel(): string {
    if (!this.profileWebsite) {
      return 'site';
    }

    return this.profileWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  private loadGitHubProfile(): void {
    this.gitHubProfileService
      .getProfile(this.githubUsername)
      .pipe(catchError(() => of(null)))
      .subscribe((profile) => {
        if (!profile) {
          return;
        }

        this.profileName = profile.name || this.profileName;
        this.githubHandle = profile.login || this.githubHandle;
        this.profileBio = profile.bio || this.profileBio;
        this.profileFollowers = profile.followers;
        this.profileFollowing = profile.following;
        this.profileCompany = profile.company || this.profileCompany;
        if (profile.company && profile.company.startsWith('@')) {
          this.profileCompanyUrl = `https://github.com/${profile.company.replace('@', '')}`;
        }
        this.profileLocation = profile.location || this.profileLocation;
        this.profileWebsite = profile.blog || this.profileWebsite;
        this.git = profile.html_url || this.git;

        if (profile.twitter_username) {
          this.profileX = `@${profile.twitter_username}`;
        }
      });
  }

  private getTimezoneLabel(): string {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const signal = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const minutes = String(abs % 60).padStart(2, '0');
    return `UTC ${signal}${hours}:${minutes}`;
  }

  changeName(): void {
    let i = 0;
    this.nameIntervalId = setInterval(() => {
      this.title = this.nameTitles[i];
      i = i === this.nameTitles.length - 1 ? 0 : i + 1;
    }, 3000);
  }

  changeiam(): void {
    let i = 0;
    this.iamIntervalId = setInterval(() => {
      this.iam = this.aboutMe[i];
      i = i === this.aboutMe.length - 1 ? 0 : i + 1;
    }, 4500);
  }
}
