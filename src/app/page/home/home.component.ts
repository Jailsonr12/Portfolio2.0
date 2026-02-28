import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';
import { PortfolioCustomCardField, PortfolioDocument } from '../../models/portfolio-data.model';
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

type HomeEditSection =
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'activity'
  | 'certifications'
  | 'curriculo'
  | 'contact'
  | 'githubProfile'
  | 'featured'
  | 'duo';
type QuickEditFieldType = 'text' | 'textarea' | 'url' | 'image';

interface QuickEditField {
  id: string;
  key: string;
  label: string;
  type: QuickEditFieldType;
  value: string;
  isCustom?: boolean;
}

interface HomeMenuItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fallbackCurriculumUrl =
    'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link';

  portfolio?: PortfolioDocument;
  isLoading = true;
  loadError = '';

  isCurriculumModalOpen = false;
  curriculumPreviewUrl = '';
  curriculumDownloadUrl = '';
  curriculumEmbedUrl?: SafeResourceUrl;
  isHomeEditModalOpen = false;
  homeEditSection: HomeEditSection = 'hero';
  homeEditDuoIndex = 0;
  quickEditFields: QuickEditField[] = [];
  homeMenuItems: HomeMenuItem[] = [];
  showStickyMenu = false;
  activeMenuId = '';

  @ViewChild('homeRoot') homeRoot?: ElementRef<HTMLElement>;
  private menuMutationObserver?: MutationObserver;
  readonly quickAddTypes: Array<{ type: QuickEditFieldType; label: string }> = [
    { type: 'text', label: 'Texto' },
    { type: 'textarea', label: 'Texto longo' },
    { type: 'url', label: 'URL' },
    { type: 'image', label: 'Imagem' },
  ];

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

  ngAfterViewInit(): void {
    this.observeMenuSections();
    this.refreshHomeMenu();
    this.onWindowScroll();
  }

  ngOnDestroy(): void {
    this.menuMutationObserver?.disconnect();
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

    return this.limitText(
      this.portfolio.linkedin.headline?.trim() ||
        this.portfolio.profile.professionalLabel ||
        'Desenvolvedor Full Stack',
      90
    );
  }

  get aboutSummary(): string {
    if (!this.portfolio) {
      return '';
    }

    return this.limitText(
      this.portfolio.linkedin.about?.trim() ||
        this.portfolio.profile.bio ||
        this.portfolio.aboutCard.summary,
      280
    );
  }

  get aboutBadges(): AboutBadgeItem[] {
    if (!this.portfolio) {
      return [];
    }

    const focus = this.limitText(
      this.portfolio.linkedin.activity?.trim() || 'Projetos e evolucao tecnica',
      72
    );
    const experience = this.limitText(
      this.portfolio.linkedin.experience?.trim() ||
        [this.portfolio.profile.company, this.portfolio.profile.location]
          .filter(Boolean)
          .join(' | ') ||
        'Experiencia em desenvolvimento web',
      72
    );
    const stack = this.limitText(
      this.portfolio.hero.primaryStack || 'Angular | TypeScript | Node.js',
      72
    );

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

  openHomeEditModal(section: HomeEditSection, duoIndex = 0): void {
    this.homeEditSection = section;
    this.homeEditDuoIndex = duoIndex;
    this.quickEditFields = this.buildQuickEditFields(section, duoIndex);
    this.isHomeEditModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeHomeEditModal(): void {
    this.isHomeEditModalOpen = false;
    document.body.style.overflow = '';
  }

  saveHomeEdit(): void {
    if (!this.portfolio) {
      return;
    }

    this.applyQuickEditFields();

    this.portfolio.sourceMode = 'manual';
    this.portfolio = this.portfolioDataService.save(this.portfolio);
    this.loadShowcaseProjects(this.portfolio);
    this.refreshHomeMenu();
    this.closeHomeEditModal();
  }

  get homeEditTitle(): string {
    const titles: Record<HomeEditSection, string> = {
      hero: 'Editar Hero',
      about: 'Editar card Sobre',
      skills: 'Editar Skills',
      projects: 'Editar secao Projetos',
      experience: 'Editar Experiencia',
      activity: 'Editar Casos de estudo',
      certifications: 'Editar Certificacoes',
      curriculo: 'Editar card Curriculo',
      contact: 'Editar Contato',
      githubProfile: 'Editar GitHub Profile',
      featured: 'Editar projeto principal',
      duo: 'Editar projeto',
    };
    return titles[this.homeEditSection];
  }

  get editingDuoProject(): ShowcaseProject | undefined {
    return this.duoProjects[this.homeEditDuoIndex];
  }

  get isImageFieldInEditor(): boolean {
    return this.quickEditFields.some((field) => field.type === 'image');
  }

  addCustomField(type: QuickEditFieldType): void {
    const id = `custom-${Date.now()}-${Math.round(Math.random() * 9999)}`;
    this.quickEditFields.push({
      id,
      key: id,
      label: 'Novo campo',
      type,
      value: '',
      isCustom: true,
    });
  }

  removeCustomField(fieldId: string): void {
    this.quickEditFields = this.quickEditFields.filter((field) => field.id !== fieldId);
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const heroSection = document.getElementById('hero');
    if (!heroSection) {
      this.showStickyMenu = false;
      this.activeMenuId = '';
      return;
    }

    const heroRect = heroSection.getBoundingClientRect();
    this.showStickyMenu = heroRect.bottom <= 72;

    const threshold = 140;
    let current = '';
    for (const item of this.homeMenuItems) {
      const section = document.getElementById(item.id);
      if (!section) {
        continue;
      }
      const rect = section.getBoundingClientRect();
      if (rect.top <= threshold) {
        current = item.id;
      }
    }
    this.activeMenuId = current || this.homeMenuItems[0]?.id || '';
  }

  getCustomFieldsFor(section: HomeEditSection, duoIndex = 0): PortfolioCustomCardField[] {
    if (!this.portfolio?.customCardFields) {
      return [];
    }

    return this.portfolio.customCardFields[this.getCardStorageKey(section, duoIndex)] || [];
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
      this.refreshHomeMenu();
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

  get editorRoute(): string[] {
    const username = this.portfolio?.username || this.detectUsername();
    return ['/protifolio', username, 'editor'];
  }

  get showEditorShortcut(): boolean {
    return true;
  }

  private syncShowcaseToProject(showcase: ShowcaseProject, index: number): void {
    if (!this.portfolio?.projects.items[index]) {
      return;
    }

    this.portfolio.projects.items[index] = {
      ...this.portfolio.projects.items[index],
      title: showcase.title,
      sobre: showcase.description,
      tecnologia: showcase.technology,
      git: showcase.githubUrl,
      link: showcase.liveUrl || '',
      img: showcase.imageUrl,
    };
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

    if (document.sourceMode === 'manual') {
      return;
    }

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

  private limitText(value: string, max: number): string {
    const text = (value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= max) {
      return text;
    }
    return `${text.slice(0, max - 3).trim()}...`;
  }

  private buildQuickEditFields(section: HomeEditSection, duoIndex: number): QuickEditField[] {
    if (!this.portfolio) {
      return [];
    }

    const field = (key: string, label: string, type: QuickEditFieldType, value: string): QuickEditField => ({
      id: key,
      key,
      label,
      type,
      value: value || '',
    });

    const withCustomFields = (baseFields: QuickEditField[]): QuickEditField[] => {
      const custom = this.getCustomFieldsFor(section, duoIndex).map((item) => ({
        id: item.id,
        key: item.id,
        label: item.label || 'Campo customizado',
        type: item.type,
        value: item.value || '',
        isCustom: true,
      }));
      return [...baseFields, ...custom];
    };

    if (section === 'hero') {
      return withCustomFields([
        field('introPrefix', 'Intro prefix', 'text', this.portfolio.hero.introPrefix),
        field('name', 'Nome de destaque', 'text', this.portfolio.profile.name),
        field('subtitleOne', 'Subtitulo 1', 'text', this.portfolio.hero.subtitleOne),
        field('subtitleTwo', 'Subtitulo 2', 'text', this.portfolio.hero.subtitleTwo),
        field('primaryStack', 'Stack principal', 'text', this.portfolio.hero.primaryStack),
        field('bio', 'Bio', 'textarea', this.portfolio.profile.bio),
        field('avatarUrl', 'Imagem de perfil', 'image', this.portfolio.profile.avatarUrl || ''),
      ]);
    }

    if (section === 'about') {
      return withCustomFields([
        field('badge', 'Badge', 'text', this.portfolio.aboutCard.badge),
        field('title', 'Titulo', 'text', this.portfolio.aboutCard.title),
        field('headline', 'Headline', 'text', this.portfolio.linkedin.headline),
        field('summary', 'Resumo', 'textarea', this.portfolio.linkedin.about || this.portfolio.aboutCard.summary),
        field('stackBadge', 'Badge Stack', 'text', this.portfolio.hero.primaryStack),
        field('focusBadge', 'Badge Foco', 'text', this.portfolio.linkedin.activity),
        field('experienceBadge', 'Badge Experiencia', 'text', this.portfolio.linkedin.experience),
      ]);
    }

    if (section === 'projects') {
      return withCustomFields([
        field('projectsTitle', 'Titulo da secao', 'text', this.portfolio.projects.title),
        field('projectsSubtitle', 'Subtitulo da secao', 'text', this.portfolio.projects.subtitle),
      ]);
    }

    if (section === 'skills') {
      const first = this.portfolio.skills[0] || { name: 'Backend', items: [] as string[] };
      const second = this.portfolio.skills[1] || { name: 'Banco', items: [] as string[] };
      const third = this.portfolio.skills[2] || { name: 'DevOps', items: [] as string[] };
      return withCustomFields([
        field('skillCategory1Name', 'Categoria 1', 'text', first.name),
        field('skillCategory1Items', 'Itens categoria 1 (separados por virgula)', 'textarea', first.items.join(', ')),
        field('skillCategory2Name', 'Categoria 2', 'text', second.name),
        field('skillCategory2Items', 'Itens categoria 2 (separados por virgula)', 'textarea', second.items.join(', ')),
        field('skillCategory3Name', 'Categoria 3', 'text', third.name),
        field('skillCategory3Items', 'Itens categoria 3 (separados por virgula)', 'textarea', third.items.join(', ')),
      ]);
    }

    if (section === 'experience') {
      const first = this.portfolio.experience[0] || {
        company: '',
        role: '',
        period: '',
        bullets: [] as string[],
        technologies: [] as string[],
      };
      return withCustomFields([
        field('experienceCompany', 'Empresa', 'text', first.company),
        field('experienceRole', 'Cargo', 'text', first.role),
        field('experiencePeriod', 'Periodo', 'text', first.period),
        field('experienceBullets', 'Bullets (uma por linha)', 'textarea', first.bullets.join('\n')),
        field('experienceTech', 'Tecnologias (separadas por virgula)', 'textarea', first.technologies.join(', ')),
      ]);
    }

    if (section === 'activity') {
      const first = this.portfolio.caseStudies[0] || { title: '', summary: '', decisions: [] as string[] };
      return withCustomFields([
        field('caseTitle', 'Titulo do caso', 'text', first.title),
        field('caseSummary', 'Resumo do caso', 'textarea', first.summary),
        field('caseDecisions', 'Decisoes (uma por linha)', 'textarea', first.decisions.join('\n')),
      ]);
    }

    if (section === 'certifications') {
      const first = this.portfolio.certifications[0] || { name: '', issuer: '', year: '', link: '' };
      return withCustomFields([
        field('certName', 'Nome', 'text', first.name),
        field('certIssuer', 'Emissor', 'text', first.issuer),
        field('certYear', 'Ano', 'text', first.year),
        field('certLink', 'Link', 'url', first.link || ''),
      ]);
    }

    if (section === 'contact') {
      return withCustomFields([
        field('contactEmail', 'Email', 'text', this.portfolio.contact.email),
        field('contactGithub', 'GitHub', 'url', this.portfolio.contact.github),
        field('contactLinkedin', 'LinkedIn', 'url', this.portfolio.contact.linkedin),
        field('contactPhone', 'Telefone', 'text', this.portfolio.contact.phone || ''),
      ]);
    }

    if (section === 'githubProfile') {
      return withCustomFields([
        field('ghHandle', 'Handle', 'text', this.portfolio.profile.handle),
        field('ghFollowers', 'Followers', 'text', String(this.portfolio.profile.followers || 0)),
        field('ghFollowing', 'Following', 'text', String(this.portfolio.profile.following || 0)),
        field('ghCompany', 'Empresa', 'text', this.portfolio.profile.company),
        field('ghLocation', 'Localizacao', 'text', this.portfolio.profile.location),
      ]);
    }

    if (section === 'curriculo') {
      return withCustomFields([
        field('curriculumTitle', 'Titulo', 'text', this.portfolio.curriculum.title),
        field('curriculumDescription', 'Descricao', 'textarea', this.portfolio.curriculum.description),
        field('curriculumUrl', 'URL', 'url', this.portfolio.curriculum.url),
      ]);
    }

    const projectIndex = section === 'featured' ? 0 : duoIndex + 1;
    const project = this.portfolio.projects.items[projectIndex];
    if (!project) {
      return [];
    }

    return withCustomFields([
      field('projectTitle', 'Titulo', 'text', project.title),
      field('projectDescription', 'Descricao', 'textarea', project.sobre),
      field('projectTechnology', 'Tecnologia', 'text', project.tecnologia),
      field('projectImage', 'Imagem do card', 'image', project.img),
      field('projectGithub', 'GitHub', 'url', project.git || ''),
      field('projectLive', 'Link publico', 'url', project.link || ''),
    ]);
  }

  private applyQuickEditFields(): void {
    if (!this.portfolio) {
      return;
    }

    const value = (key: string): string =>
      this.quickEditFields.find((field) => field.key === key)?.value?.trim() || '';

    if (this.homeEditSection === 'hero') {
      this.portfolio.hero.introPrefix = value('introPrefix');
      this.portfolio.profile.name = value('name');
      this.portfolio.hero.subtitleOne = value('subtitleOne');
      this.portfolio.hero.subtitleTwo = value('subtitleTwo');
      this.portfolio.hero.primaryStack = value('primaryStack');
      this.portfolio.profile.bio = value('bio');
      this.portfolio.profile.avatarUrl = value('avatarUrl');
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'about') {
      this.portfolio.aboutCard.badge = value('badge');
      this.portfolio.aboutCard.title = value('title');
      this.portfolio.linkedin.headline = value('headline');
      this.portfolio.linkedin.about = value('summary');
      this.portfolio.hero.primaryStack = value('stackBadge');
      this.portfolio.linkedin.activity = value('focusBadge');
      this.portfolio.linkedin.experience = value('experienceBadge');
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'projects') {
      this.portfolio.projects.title = value('projectsTitle');
      this.portfolio.projects.subtitle = value('projectsSubtitle');
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'skills') {
      this.portfolio.skills = [
        {
          name: value('skillCategory1Name') || 'Backend',
          items: this.splitCsv(value('skillCategory1Items')),
        },
        {
          name: value('skillCategory2Name') || 'Banco',
          items: this.splitCsv(value('skillCategory2Items')),
        },
        {
          name: value('skillCategory3Name') || 'DevOps',
          items: this.splitCsv(value('skillCategory3Items')),
        },
      ];
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'experience') {
      this.portfolio.experience = [
        {
          company: value('experienceCompany'),
          role: value('experienceRole'),
          period: value('experiencePeriod'),
          bullets: this.splitLines(value('experienceBullets')),
          technologies: this.splitCsv(value('experienceTech')),
        },
      ];
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'activity') {
      this.portfolio.caseStudies = [
        {
          title: value('caseTitle'),
          summary: value('caseSummary'),
          decisions: this.splitLines(value('caseDecisions')),
        },
      ];
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'certifications') {
      this.portfolio.certifications = [
        {
          name: value('certName'),
          issuer: value('certIssuer'),
          year: value('certYear'),
          link: value('certLink'),
        },
      ];
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'contact') {
      this.portfolio.contact = {
        ...this.portfolio.contact,
        email: value('contactEmail'),
        github: value('contactGithub'),
        linkedin: value('contactLinkedin'),
        phone: value('contactPhone'),
      };
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'githubProfile') {
      this.portfolio.profile.handle = value('ghHandle');
      this.portfolio.profile.followers = Number(value('ghFollowers')) || 0;
      this.portfolio.profile.following = Number(value('ghFollowing')) || 0;
      this.portfolio.profile.company = value('ghCompany');
      this.portfolio.profile.location = value('ghLocation');
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'curriculo') {
      this.portfolio.curriculum.title = value('curriculumTitle');
      this.portfolio.curriculum.description = value('curriculumDescription');
      this.portfolio.curriculum.url = value('curriculumUrl');
      this.applyCurriculumLinks(this.getCurriculumUrl(this.portfolio));
      this.persistCustomFields();
      return;
    }

    const projectIndex = this.homeEditSection === 'featured' ? 0 : this.homeEditDuoIndex + 1;
    if (!this.portfolio.projects.items[projectIndex]) {
      return;
    }

    this.portfolio.projects.items[projectIndex] = {
      ...this.portfolio.projects.items[projectIndex],
      title: value('projectTitle'),
      sobre: value('projectDescription'),
      tecnologia: value('projectTechnology'),
      img: value('projectImage'),
      git: value('projectGithub'),
      link: value('projectLive'),
    };
    this.persistCustomFields();
  }

  private persistCustomFields(): void {
    if (!this.portfolio) {
      return;
    }

    const key = this.getCardStorageKey(this.homeEditSection, this.homeEditDuoIndex);
    const custom = this.quickEditFields
      .filter((field) => field.isCustom)
      .map((field) => ({
        id: field.id,
        label: (field.label || '').trim(),
        value: (field.value || '').trim(),
        type: field.type,
      }))
      .filter((field) => field.label || field.value);

    if (!this.portfolio.customCardFields) {
      this.portfolio.customCardFields = {};
    }

    if (custom.length) {
      this.portfolio.customCardFields[key] = custom;
    } else {
      delete this.portfolio.customCardFields[key];
    }
  }

  private getCardStorageKey(section: HomeEditSection, duoIndex: number): string {
    if (section === 'duo') {
      return `duo-${duoIndex}`;
    }
    return section;
  }

  private splitCsv(value: string): string[] {
    return (value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private splitLines(value: string): string[] {
    return (value || '')
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private observeMenuSections(): void {
    if (!this.homeRoot?.nativeElement) {
      return;
    }

    this.menuMutationObserver?.disconnect();
    this.menuMutationObserver = new MutationObserver(() => {
      this.refreshHomeMenu();
      this.onWindowScroll();
    });

    this.menuMutationObserver.observe(this.homeRoot.nativeElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'data-nav-id', 'data-nav-label'],
    });
  }

  private refreshHomeMenu(): void {
    const root = this.homeRoot?.nativeElement;
    if (!root) {
      this.homeMenuItems = [];
      return;
    }

    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[data-nav-id]'));
    const seen = new Set<string>();
    this.homeMenuItems = sections
      .map((section) => ({
        id: section.dataset['navId'] || '',
        label: section.dataset['navLabel'] || section.id || 'Secao',
      }))
      .filter((item) => Boolean(item.id) && !seen.has(item.id) && seen.add(item.id));
  }
}
