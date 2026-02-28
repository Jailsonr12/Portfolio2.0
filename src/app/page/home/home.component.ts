import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { PortfolioDocument } from '../../models/portfolio-data.model';
import { PortfolioBlockKey } from '../../models/portfolio-layout.model';
import { GitHubProfileService, GitHubRepo } from '../../services/github-profile.service';
import { PortfolioDataService } from '../../services/portfolio-data.service';

interface ShowcaseProject {
  title: string;
  description: string;
  technology: string;
  githubUrl: string;
  liveUrl?: string;
  imageUrl: string;
}

interface AboutBadgeItem {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly fallbackCurriculumUrl =
    'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link';

  portfolio?: PortfolioDocument;
  isLoading = true;
  loadError = '';

  isCurriculumModalOpen = false;
  curriculumPreviewUrl = '';
  curriculumDownloadUrl = '';
  curriculumEmbedUrl?: SafeResourceUrl;

  featuredProject?: ShowcaseProject;
  duoProjects: ShowcaseProject[] = [];

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly portfolioDataService: PortfolioDataService,
    private readonly gitHubProfileService: GitHubProfileService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
  }

  get orderedHomeBlocks(): PortfolioBlockKey[] {
    if (!this.portfolio) {
      return [];
    }

    return this.portfolio.layoutOrder.filter((block) => this.portfolio?.blocks[block]?.enabled);
  }

  get aboutHeadline(): string {
    if (!this.portfolio) {
      return '';
    }

    return (
      this.portfolio.linkedin.headline?.trim() ||
      this.portfolio.profile.professionalLabel ||
      'Desenvolvedor Full Stack'
    );
  }

  get aboutSummary(): string {
    if (!this.portfolio) {
      return '';
    }

    return (
      this.portfolio.linkedin.about?.trim() ||
      this.portfolio.profile.bio ||
      this.portfolio.aboutCard.summary
    );
  }

  get aboutBadges(): AboutBadgeItem[] {
    if (!this.portfolio) {
      return [];
    }

    const focus = this.portfolio.linkedin.activity?.trim() || 'Projetos e evolucao tecnica';
    const experience =
      this.portfolio.linkedin.experience?.trim() ||
      [this.portfolio.profile.company, this.portfolio.profile.location]
        .filter(Boolean)
        .join(' • ') ||
      'Experiencia em desenvolvimento web';
    const stack = this.portfolio.hero.primaryStack || 'Angular • TypeScript • Node.js';

    return [
      { label: 'Stack', value: stack },
      { label: 'Foco', value: focus },
      { label: 'Experiencia', value: experience },
    ];
  }

  openCurriculumModal(): void {
    this.isCurriculumModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeCurriculumModal(): void {
    this.isCurriculumModalOpen = false;
    document.body.style.overflow = '';
  }

  private async loadPortfolio(): Promise<void> {
    this.isLoading = true;
    this.loadError = '';

    try {
      const username = this.detectUsername();
      this.portfolio = await this.portfolioDataService.load(username);

      const curriculumUrl = this.getCurriculumUrl(this.portfolio);
      this.applyCurriculumLinks(curriculumUrl);
      await this.loadShowcaseProjects(this.portfolio);
    } catch {
      this.loadError = 'Nao foi possivel carregar os dados do portfolio.';
    } finally {
      this.isLoading = false;
    }
  }

  private getCurriculumUrl(document: PortfolioDocument): string {
    return document.curriculum.url || document.socialLinks.curriculum || this.fallbackCurriculumUrl;
  }

  private detectUsername(): string {
    const path = window.location.pathname;
    const match = path.match(/\/protifolio\/([^/?#]+)/i);
    const usernameFromRoute = match?.[1]?.trim();
    if (usernameFromRoute && usernameFromRoute !== 'home') {
      return usernameFromRoute.toLowerCase();
    }

    return 'jailsonr12';
  }

  private applyCurriculumLinks(url: string): void {
    this.curriculumPreviewUrl = this.buildCurriculumPreviewUrl(url);
    this.curriculumDownloadUrl = this.buildCurriculumDownloadUrl(url);
    this.curriculumEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.buildCurriculumEmbedUrl(url)
    );
  }

  private async loadShowcaseProjects(document: PortfolioDocument): Promise<void> {
    const fallback = this.mapFallbackProjects(document);
    this.featuredProject = fallback.featured;
    this.duoProjects = fallback.duo;

    const githubUsername = this.extractGithubUsername(document.socialLinks.github);
    if (!githubUsername) {
      return;
    }

    try {
      const repos = await firstValueFrom(this.gitHubProfileService.getRepos(githubUsername));
      const mapped = this.mapReposToShowcase(repos, githubUsername);
      if (mapped.length) {
        this.featuredProject = mapped[0];
      }
      if (mapped.length > 1) {
        this.duoProjects = mapped.slice(1, 3);
      }
    } catch {
      // Keep fallback
    }
  }

  private mapReposToShowcase(repos: GitHubRepo[], owner: string): ShowcaseProject[] {
    return repos
      .filter((repo) => !repo.name.startsWith('.'))
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
      .map((repo) => ({
        title: repo.name,
        description: repo.description || 'Repositorio do GitHub com codigo e evolucao do projeto.',
        technology: repo.language || 'Stack mista',
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || undefined,
        imageUrl: `https://opengraph.githubassets.com/1/${owner}/${repo.name}`,
      }));
  }

  private mapFallbackProjects(document: PortfolioDocument): {
    featured?: ShowcaseProject;
    duo: ShowcaseProject[];
  } {
    const list = document.projects.items || [];
    const featuredFromDevs =
      list.find((project) => project.title.toLowerCase().includes('devs2blu')) || list[0];

    const asShowcase = (
      title = '',
      sobre = '',
      tecnologia = '',
      git = '',
      link = '',
      img = ''
    ): ShowcaseProject => ({
      title,
      description: sobre || 'Projeto em destaque do portfolio.',
      technology: tecnologia || 'Stack personalizada',
      githubUrl: git || '#',
      liveUrl: link || undefined,
      imageUrl: img || './assets/jailsonr12.github.io_portfolio_.png',
    });

    const featured = featuredFromDevs
      ? asShowcase(
          featuredFromDevs.title,
          featuredFromDevs.sobre,
          featuredFromDevs.tecnologia,
          featuredFromDevs.git || '',
          featuredFromDevs.link || '',
          featuredFromDevs.img
        )
      : undefined;

    const duo = list
      .filter((project) => project !== featuredFromDevs)
      .slice(0, 2)
      .map((project) =>
        asShowcase(
          project.title,
          project.sobre,
          project.tecnologia,
          project.git || '',
          project.link || '',
          project.img
        )
      );

    return { featured, duo };
  }

  private extractGithubUsername(url: string): string {
    const match = url.match(/github\.com\/([^/?#]+)/i);
    return match?.[1]?.trim() || '';
  }

  private buildCurriculumPreviewUrl(url: string): string {
    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (!fileMatch?.[1]) {
      return '';
    }

    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w1200`;
  }

  private buildCurriculumEmbedUrl(url: string): string {
    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (!fileMatch?.[1]) {
      return '';
    }

    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  private buildCurriculumDownloadUrl(url: string): string {
    const fileMatch = url.match(/\/d\/([^/]+)/);
    if (!fileMatch?.[1]) {
      return url;
    }

    return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
  }
}
