import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  PortfolioCaseStudy,
  PortfolioCustomCardField,
  PortfolioDocument,
  PortfolioExperienceEntry,
  PortfolioSkillCategory,
  PortfolioViewPreferences,
} from '../../models/portfolio-data.model';
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
type QuickEditFieldType = 'text' | 'textarea' | 'url' | 'image' | 'toggle' | 'number' | 'select';

interface QuickEditField {
  id: string;
  key: string;
  label: string;
  type: QuickEditFieldType;
  value: string;
  options?: Array<{ label: string; value: string }>;
  isCustom?: boolean;
}

interface HomeMenuItem {
  id: string;
  label: string;
}

interface ProjectFieldDraft {
  title: string;
  description: string;
  technology: string;
  image: string;
  github: string;
  live: string;
}

interface ModuleCatalogItem {
  block: PortfolioBlockKey;
  section: HomeEditSection;
  label: string;
  summary: string;
  modelName?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly fallbackCurriculumUrl =
    'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link';
  private readonly visibleHomeBlocks: PortfolioBlockKey[] = ['hero', 'about', 'projects'];

  portfolio?: PortfolioDocument;
  isLoading = true;
  loadError = '';

  isCurriculumModalOpen = false;
  curriculumPreviewUrl = '';
  curriculumDownloadUrl = '';
  curriculumEmbedUrl?: SafeResourceUrl;
  isHomeEditModalOpen = false;
  isModuleCatalogOpen = false;
  homeEditSection: HomeEditSection = 'hero';
  homeEditDuoIndex = 0;
  quickEditFields: QuickEditField[] = [];
  homeMenuItems: HomeMenuItem[] = [];
  showStickyMenu = false;
  activeMenuId = '';
  isCustomizerPanelOpen = true;

  @ViewChild('homeRoot') homeRoot?: ElementRef<HTMLElement>;
  private menuMutationObserver?: MutationObserver;
  private isMenuRefreshScheduled = false;
  readonly quickAddTypes: Array<{ type: QuickEditFieldType; label: string }> = [
    { type: 'text', label: 'Texto' },
    { type: 'textarea', label: 'Texto longo' },
    { type: 'url', label: 'URL' },
    { type: 'image', label: 'Imagem' },
  ];
  readonly moduleCatalog: ModuleCatalogItem[] = [
    {
      block: 'hero',
      section: 'hero',
      label: 'Hero',
      summary: 'Apresentacao principal, titulo, links e avatar.',
      modelName: 'Modelo Hero',
    },
    {
      block: 'about',
      section: 'about',
      label: 'Sobre',
      summary: 'Resumo profissional e destaques do perfil.',
      modelName: 'Modelo Sobre',
    },
    {
      block: 'projects',
      section: 'projects',
      label: 'Projetos',
      summary: 'Titulo da secao, lista de cards e links.',
      modelName: 'Modelo Projetos',
    },
  ];

  featuredProject?: ShowcaseProject;
  duoProjects: ShowcaseProject[] = [];

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly portfolioDataService: PortfolioDataService,
    private readonly gitHubProfileService: GitHubProfileService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPortfolio();
  }

  ngAfterViewInit(): void {
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

    const order = Array.isArray(this.portfolio.layoutOrder) ? this.portfolio.layoutOrder : [];
    const blocks = this.portfolio.blocks;
    const enabled = order.filter(
      (block) => this.visibleHomeBlocks.includes(block) && blocks?.[block]?.enabled
    );
    if (enabled.length) {
      return enabled;
    }

    if (blocks?.hero?.enabled) {
      return ['hero'];
    }

    return this.visibleHomeBlocks.filter((block) => blocks?.[block]?.enabled).slice(0, 1);
  }

  get aboutHeadline(): string {
    if (!this.portfolio) {
      return '';
    }

    return (
      this.portfolio.aboutCard.title?.trim() ||
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
      this.portfolio.aboutCard.summary?.trim() ||
      this.portfolio.linkedin.about?.trim() ||
      this.portfolio.profile.bio ||
      ''
    );
  }

  get aboutBadges(): AboutBadgeItem[] {
    if (!this.portfolio) {
      return [];
    }

    const highlights = (this.portfolio.aboutCard.highlights || [])
      .map((item) => ({
        label: (item.label || '').trim(),
        value: (item.value || '').trim(),
      }))
      .filter((item) => item.label || item.value);

    if (highlights.length) {
      return highlights;
    }

    return [
      { label: 'Especialidade', value: 'Angular + TypeScript' },
      { label: 'Atuacao', value: 'Desenvolvimento web full stack' },
      { label: 'Diferencial', value: 'Layout organizado e escalavel' },
    ];
  }

  get githubProfileEnabled(): boolean {
    return this.portfolio?.blocks?.githubProfile?.enabled ?? true;
  }

  get linkedInProfileUrl(): string {
    if (!this.portfolio) {
      return '';
    }

    const directUrl = (this.portfolio.socialLinks.linkedin || '').trim();
    if (directUrl) {
      return this.normalizeLinkedinUrl(directUrl);
    }

    const path = (this.portfolio.profile.linkedinPath || '').trim();
    if (path) {
      return `https://www.linkedin.com/${path.replace(/^\/+/, '')}`;
    }

    const user = (this.portfolio.profile.linkedinUser || '').trim().replace(/^@/, '');
    return user ? `https://www.linkedin.com/in/${user}` : '';
  }

  get safeSkills(): PortfolioSkillCategory[] {
    return this.portfolio?.skills?.length
      ? this.portfolio.skills
      : [
          { name: 'Backend', items: ['Java', 'Spring Boot', 'REST', 'JPA'] },
          { name: 'Banco', items: ['PostgreSQL', 'SQL'] },
        ];
  }

  get firstExperienceEntry(): PortfolioExperienceEntry {
    return (
      this.portfolio?.experience?.[0] || {
        company: 'Trajetoria profissional',
        role: 'Desenvolvedor',
        period: 'Atual',
        bullets: ['Descreva o impacto principal da sua atuacao.'],
        technologies: [],
      }
    );
  }

  get firstCaseStudy(): PortfolioCaseStudy {
    return (
      this.portfolio?.caseStudies?.[0] || {
        title: 'Resultado tecnico',
        summary: 'Descreva um caso tecnico relevante.',
        decisions: ['Decisao tecnica principal'],
      }
    );
  }

  get safeCertifications(): Array<{ name: string; issuer: string; year: string; link?: string }> {
    return this.portfolio?.certifications?.length
      ? this.portfolio.certifications
      : [{ name: 'Certificacao', issuer: 'Emissor', year: '2026' }];
  }

  get heroViewPreferences(): PortfolioViewPreferences['hero'] {
    return this.getViewPreferences().hero;
  }

  get aboutViewPreferences(): PortfolioViewPreferences['about'] {
    return this.getViewPreferences().about;
  }

  get skillsViewPreferences(): PortfolioViewPreferences['skills'] {
    return this.getViewPreferences().skills;
  }

  get projectsViewPreferences(): PortfolioViewPreferences['projects'] {
    return this.getViewPreferences().projects;
  }

  get contactViewPreferences(): PortfolioViewPreferences['contact'] {
    return this.getViewPreferences().contact;
  }

  get githubProfileViewPreferences(): PortfolioViewPreferences['githubProfile'] {
    return this.getViewPreferences().githubProfile;
  }

  get animationViewPreferences(): PortfolioViewPreferences['animations'] {
    return this.getViewPreferences().animations;
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
    if (section === 'githubProfile') {
      this.openProfileEditorScreen();
      return;
    }

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

  openModuleCatalogModal(): void {
    this.isModuleCatalogOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModuleCatalogModal(): void {
    this.isModuleCatalogOpen = false;
    document.body.style.overflow = '';
  }

  isModuleEnabled(item: ModuleCatalogItem): boolean {
    return this.portfolio?.blocks?.[item.block]?.enabled ?? false;
  }

  openModuleFromCatalog(item: ModuleCatalogItem): void {
    if (!this.portfolio) {
      return;
    }

    if (!this.portfolio.blocks[item.block]) {
      this.portfolio.blocks[item.block] = { enabled: true };
    } else {
      this.portfolio.blocks[item.block].enabled = true;
    }

    if (!this.portfolio.layoutOrder.includes(item.block)) {
      this.portfolio.layoutOrder.push(item.block);
    }

    this.portfolio.sourceMode = 'manual';
    this.portfolio = this.portfolioDataService.save(this.portfolio);
    this.refreshHomeMenu();

    this.closeModuleCatalogModal();
    if (item.section === 'githubProfile') {
      this.openProfileEditorScreen();
      return;
    }
    this.openHomeEditModal(item.section);
  }

  toggleCustomizerPanel(): void {
    this.isCustomizerPanelOpen = !this.isCustomizerPanelOpen;
  }

  openEditorFromPanel(item: ModuleCatalogItem): void {
    if (!this.portfolio) {
      return;
    }

    if (item.section === 'githubProfile') {
      if (!this.isModuleEnabled(item)) {
        this.openModuleFromCatalog(item);
        return;
      }
      this.openProfileEditorScreen();
      return;
    }

    if (this.isModuleEnabled(item)) {
      this.openHomeEditModal(item.section);
      return;
    }

    this.openModuleFromCatalog(item);
  }

  openProfileEditorScreen(): void {
    const username = this.portfolio?.username || this.detectUsername();
    void this.router.navigate(['/protifolio', username, 'editor'], {
      queryParams: { section: 'githubProfile' },
    });
  }

  openFeaturedProjectEditor(): void {
    this.ensureProjectItem(0);
    this.openHomeEditModal('featured');
  }

  openSecondaryProjectEditor(index: number): void {
    const safeIndex = Math.max(0, Math.min(index, 1));
    this.ensureProjectItem(safeIndex + 1);
    this.openHomeEditModal('duo', safeIndex);
  }

  hasProjectAt(index: number): boolean {
    return Boolean(this.portfolio?.projects?.items?.[index]);
  }

  get orderedModules(): ModuleCatalogItem[] {
    if (!this.portfolio) {
      return [];
    }

    const order = this.portfolio.layoutOrder || [];
    const mapped = order
      .map((block) => this.moduleCatalog.find((item) => item.block === block))
      .filter((item): item is ModuleCatalogItem => Boolean(item));

    const missing = this.moduleCatalog.filter(
      (item) => !mapped.some((mappedItem) => mappedItem.block === item.block)
    );
    return [...mapped, ...missing];
  }

  get customizerToggleLabel(): string {
    const title = this.getSectionTitle('about');
    return this.isCustomizerPanelOpen ? `Fechar painel (${title})` : `Abrir painel (${title})`;
  }

  getModuleTitle(item: ModuleCatalogItem): string {
    return this.getSectionTitle(item.section);
  }

  getModuleModelName(item: ModuleCatalogItem): string {
    return item.modelName || `Modelo ${this.getSectionTitle(item.section)}`;
  }

  getNavLabel(section: HomeEditSection): string {
    if (section === 'hero') {
      return 'Inicio';
    }

    const title = this.getSectionTitle(section);
    if (!title) {
      return this.getSectionFallbackTitle(section);
    }

    return title.length > 24 ? `${title.slice(0, 24).trim()}...` : title;
  }

  canMoveModule(item: ModuleCatalogItem, direction: 'up' | 'down'): boolean {
    if (!this.portfolio) {
      return false;
    }

    const index = this.portfolio.layoutOrder.indexOf(item.block);
    if (index < 0) {
      return false;
    }

    if (direction === 'up') {
      return index > 0;
    }

    return index < this.portfolio.layoutOrder.length - 1;
  }

  moveModule(item: ModuleCatalogItem, direction: 'up' | 'down'): void {
    if (!this.portfolio) {
      return;
    }

    const nextOrder = [...this.portfolio.layoutOrder];
    const index = nextOrder.indexOf(item.block);
    if (index < 0) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nextOrder.length) {
      return;
    }

    [nextOrder[index], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[index]];
    this.portfolio.layoutOrder = nextOrder;
    this.portfolio.sourceMode = 'manual';
    this.portfolio = this.portfolioDataService.save(this.portfolio);
    this.refreshHomeMenu();
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
    if (this.homeEditSection === 'featured') {
      return 'Editar projeto principal';
    }

    if (this.homeEditSection === 'duo') {
      return `Editar projeto secundario ${this.homeEditDuoIndex + 1}`;
    }
    return `Editar ${this.getSectionTitle(this.homeEditSection)}`;
  }

  get editingDuoProject(): ShowcaseProject | undefined {
    return this.duoProjects[this.homeEditDuoIndex];
  }

  get isImageFieldInEditor(): boolean {
    return this.quickEditFields.some((field) => field.type === 'image');
  }

  get aboutHighlightCount(): number {
    return this.extractAboutHighlightIndexes().length;
  }

  get skillCategoryCount(): number {
    return this.extractSkillCategoryIndexes().length;
  }

  get projectItemCount(): number {
    return this.extractProjectItemIndexes().length;
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

  getFieldPlaceholder(field: QuickEditField, isLabelField = false): string {
    if (isLabelField) {
      return 'Nome do campo';
    }

    const label = (field.label || '').trim() || 'campo';
    if (field.type === 'url') {
      return 'https://exemplo.com';
    }
    if (field.type === 'image') {
      return 'https://exemplo.com/imagem.jpg';
    }
    if (field.type === 'textarea') {
      return `Digite ${label.toLowerCase()}`;
    }
    if (field.type === 'select' || field.type === 'toggle') {
      return '';
    }
    if (field.type === 'number') {
      return '1';
    }
    return `Digite ${label.toLowerCase()}`;
  }

  addAboutHighlightField(): void {
    if (this.homeEditSection !== 'about') {
      return;
    }

    const nextIndex = Math.max(...this.extractAboutHighlightIndexes(), 0) + 1;
    this.quickEditFields.push(
      {
        id: `aboutHighlight${nextIndex}Label`,
        key: `aboutHighlight${nextIndex}Label`,
        label: `Destaque ${nextIndex} - titulo`,
        type: 'text',
        value: '',
      },
      {
        id: `aboutHighlight${nextIndex}Value`,
        key: `aboutHighlight${nextIndex}Value`,
        label: `Destaque ${nextIndex} - valor`,
        type: 'text',
        value: '',
      }
    );
  }

  removeAboutHighlightField(): void {
    if (this.homeEditSection !== 'about') {
      return;
    }

    const indexes = this.extractAboutHighlightIndexes();
    const lastIndex = indexes[indexes.length - 1];
    if (!lastIndex || indexes.length <= 1) {
      return;
    }

    this.quickEditFields = this.quickEditFields.filter(
      (field) =>
        field.key !== `aboutHighlight${lastIndex}Label` &&
        field.key !== `aboutHighlight${lastIndex}Value`
    );
  }

  addSkillCategoryField(): void {
    if (this.homeEditSection !== 'skills') {
      return;
    }

    const nextIndex = Math.max(...this.extractSkillCategoryIndexes(), 0) + 1;
    this.quickEditFields.push(
      {
        id: `skillCategory${nextIndex}Name`,
        key: `skillCategory${nextIndex}Name`,
        label: `Categoria ${nextIndex}`,
        type: 'text',
        value: '',
      },
      {
        id: `skillCategory${nextIndex}Items`,
        key: `skillCategory${nextIndex}Items`,
        label: `Itens categoria ${nextIndex} (separados por virgula)`,
        type: 'textarea',
        value: '',
      }
    );
  }

  removeSkillCategoryField(): void {
    if (this.homeEditSection !== 'skills') {
      return;
    }

    const indexes = this.extractSkillCategoryIndexes();
    const lastIndex = indexes[indexes.length - 1];
    if (!lastIndex || indexes.length <= 1) {
      return;
    }

    this.quickEditFields = this.quickEditFields.filter(
      (field) =>
        field.key !== `skillCategory${lastIndex}Name` &&
        field.key !== `skillCategory${lastIndex}Items`
    );
  }

  addProjectItemField(): void {
    if (this.homeEditSection !== 'projects') {
      return;
    }

    const nextIndex = Math.max(...this.extractProjectItemIndexes(), 0) + 1;
    this.quickEditFields.push(
      ...this.buildProjectItemFields(nextIndex, {
        title: '',
        description: '',
        technology: '',
        image: '',
        github: '',
        live: '',
      })
    );
  }

  removeProjectItemField(): void {
    if (this.homeEditSection !== 'projects') {
      return;
    }

    const indexes = this.extractProjectItemIndexes();
    const lastIndex = indexes[indexes.length - 1];
    if (!lastIndex || indexes.length <= 1) {
      return;
    }

    this.quickEditFields = this.quickEditFields.filter(
      (field) => !field.key.startsWith(`projectItem${lastIndex}`)
    );
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
    const username = this.detectUsername();

    const safeBaseline = this.buildEmergencyPortfolio(username);
    this.ensureHeroInLayout(safeBaseline);
    this.portfolio = safeBaseline;
    this.applyCurriculumLinks(this.getCurriculumUrl(safeBaseline));
    this.refreshHomeMenu();

    try {
      this.portfolio = await this.withTimeout(this.portfolioDataService.load(username), 7000);
      this.ensureHeroInLayout(this.portfolio);

      const curriculumUrl = this.getCurriculumUrl(this.portfolio);
      this.applyCurriculumLinks(curriculumUrl);
      void this.withTimeout(this.loadShowcaseProjects(this.portfolio), 7000).catch(() => undefined);
      this.refreshHomeMenu();
    } catch {
      this.loadError = 'Nao foi possivel carregar os dados do portfolio. Carregando modo seguro.';
    } finally {
      this.isLoading = false;
    }
  }

  private getCurriculumUrl(document: PortfolioDocument): string {
    const direct = this.normalizeCurriculumUrl(document.curriculum.url, document);
    if (direct) {
      return direct;
    }

    const social = this.normalizeCurriculumUrl(document.socialLinks.curriculum, document);
    if (social) {
      return social;
    }

    return this.fallbackCurriculumUrl;
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
        technology: repo.language || 'Tecnologia mista',
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
      technology: tecnologia || 'Tecnologia personalizada',
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

  private buildQuickEditFields(section: HomeEditSection, duoIndex: number): QuickEditField[] {
    if (!this.portfolio) {
      return [];
    }
    const viewPrefs = this.getViewPreferences();
    const alignOptions = [
      { label: 'Esquerda', value: 'left' },
      { label: 'Centro', value: 'center' },
      { label: 'Direita', value: 'right' },
    ];

    const field = (key: string, label: string, type: QuickEditFieldType, value: string): QuickEditField => ({
      id: key,
      key,
      label,
      type,
      value: value || '',
    });
    const toggleField = (key: string, label: string, value: boolean): QuickEditField => ({
      id: key,
      key,
      label,
      type: 'toggle',
      value: value ? '1' : '0',
    });
    const numberField = (key: string, label: string, value: number): QuickEditField => ({
      id: key,
      key,
      label,
      type: 'number',
      value: String(value),
    });
    const selectField = (
      key: string,
      label: string,
      value: 'left' | 'center' | 'right'
    ): QuickEditField => ({
      id: key,
      key,
      label,
      type: 'select',
      value,
      options: alignOptions,
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
        toggleField('animEnabled', 'Ativar animacoes da pagina', viewPrefs.animations.enabled),
        numberField(
          'animSectionDurationMs',
          'Duracao da entrada das secoes (ms)',
          viewPrefs.animations.sectionDurationMs
        ),
        numberField('animCardDurationMs', 'Duracao da entrada dos cards (ms)', viewPrefs.animations.cardDurationMs),
        numberField('animCardStaggerMs', 'Atraso entre cards (ms)', viewPrefs.animations.cardStaggerMs),
        numberField(
          'animCardHoverLiftPx',
          'Altura do hover dos cards (px)',
          viewPrefs.animations.cardHoverLiftPx
        ),
        toggleField('heroShowLinkedin', 'Exibir botao LinkedIn no Hero', viewPrefs.hero.showHeroLinkedin),
        toggleField('heroShowCurriculum', 'Exibir botao Curriculo no Hero', viewPrefs.hero.showHeroCurriculum),
        toggleField('heroShowProfileGithub', 'Exibir bloco GitHub no Hero', viewPrefs.hero.showProfileGithub),
        toggleField('heroShowProfileX', 'Exibir X no perfil Hero', viewPrefs.hero.showProfileX),
        toggleField('heroShowProfileLinkedin', 'Exibir LinkedIn no perfil Hero', viewPrefs.hero.showProfileLinkedin),
        toggleField('heroShowProfileWebsite', 'Exibir website no perfil Hero', viewPrefs.hero.showProfileWebsite),
        field('introPrefix', 'Intro prefix', 'text', this.portfolio.hero.introPrefix),
        field('name', 'Nome de destaque', 'text', this.portfolio.profile.name),
        field('typingNames', 'Nomes animados (separados por virgula)', 'textarea', this.portfolio.hero.typingNames.join(', ')),
        field('subtitleOne', 'Subtitulo 1', 'text', this.portfolio.hero.subtitleOne),
        field('subtitleTwo', 'Subtitulo 2', 'text', this.portfolio.hero.subtitleTwo),
        field('primaryStack', 'Stack principal', 'text', this.portfolio.hero.primaryStack),
        field('aboutRotator', 'Textos rotativos (uma linha por item)', 'textarea', this.portfolio.hero.aboutRotator.join('\n')),
        field('bio', 'Bio', 'textarea', this.portfolio.profile.bio),
        field('heroGithub', 'GitHub', 'url', this.portfolio.socialLinks.github),
        field('heroLinkedin', 'LinkedIn', 'url', this.portfolio.socialLinks.linkedin),
        field('heroCurriculum', 'Link curriculo', 'url', this.portfolio.curriculum.url || this.portfolio.socialLinks.curriculum),
        field('heroWebsite', 'Website', 'url', this.portfolio.socialLinks.website || this.portfolio.profile.website),
        field('heroX', 'X', 'text', this.portfolio.socialLinks.x || this.portfolio.profile.x),
        field('avatarUrl', 'Imagem de perfil', 'image', this.portfolio.profile.avatarUrl || ''),
      ]);
    }

    if (section === 'about') {
      const highlights = this.portfolio.aboutCard.highlights.length
        ? this.portfolio.aboutCard.highlights
        : [
            { label: 'Especialidade', value: 'Angular + TypeScript' },
            { label: 'Atuacao', value: 'Desenvolvimento web full stack' },
            { label: 'Diferencial', value: 'Layout organizado e escalavel' },
          ];

      const highlightFields = highlights.flatMap((item, index) => {
        const position = index + 1;
        return [
          field(`aboutHighlight${position}Label`, `Destaque ${position} - titulo`, 'text', item.label),
          field(`aboutHighlight${position}Value`, `Destaque ${position} - valor`, 'text', item.value),
        ];
      });

      return withCustomFields([
        toggleField('aboutShowTitle', 'Exibir titulo', viewPrefs.about.showTitle),
        toggleField('aboutShowSummary', 'Exibir resumo', viewPrefs.about.showSummary),
        toggleField('aboutShowHighlights', 'Exibir destaques', viewPrefs.about.showHighlights),
        selectField('aboutTitleAlign', 'Alinhamento do titulo', viewPrefs.about.titleAlign),
        selectField('aboutTextAlign', 'Alinhamento do texto', viewPrefs.about.textAlign),
        field('badge', 'Badge', 'text', this.portfolio.aboutCard.badge),
        field('title', 'Titulo principal', 'text', this.portfolio.aboutCard.title || this.aboutHeadline),
        field(
          'summary',
          'Resumo principal',
          'textarea',
          this.portfolio.aboutCard.summary || this.aboutSummary
        ),
        ...highlightFields,
      ]);
    }

    if (section === 'projects') {
      return withCustomFields([
        toggleField('projectsShowTitle', 'Exibir titulo da secao', viewPrefs.projects.showTitle),
        toggleField('projectsShowSubtitle', 'Exibir subtitulo da secao', viewPrefs.projects.showSubtitle),
        toggleField('projectsShowDescription', 'Exibir descricoes dos projetos', viewPrefs.projects.showDescription),
        toggleField('projectsShowTechnology', 'Exibir tecnologias dos projetos', viewPrefs.projects.showTechnology),
        toggleField('projectsShowImages', 'Exibir imagens dos projetos', viewPrefs.projects.showImages),
        numberField('projectsMaxVisibleItems', 'Quantidade maxima de cards de projeto', viewPrefs.projects.maxVisibleItems),
        field('projectsTitle', 'Titulo da secao', 'text', this.portfolio.projects.title),
        field('projectsSubtitle', 'Subtitulo da secao', 'text', this.portfolio.projects.subtitle),
      ]);
    }

    if (section === 'skills') {
      const categories = this.portfolio.skills.length
        ? this.portfolio.skills
        : [
            { name: 'Backend', items: [] as string[] },
            { name: 'Banco', items: [] as string[] },
            { name: 'DevOps', items: [] as string[] },
          ];

      const baseFields = categories.flatMap((category, index) => {
        const position = index + 1;
        return [
          field(`skillCategory${position}Name`, `Categoria ${position}`, 'text', category.name),
          field(
            `skillCategory${position}Items`,
            `Itens categoria ${position} (separados por virgula)`,
            'textarea',
            category.items.join(', ')
          ),
        ];
      });

      return withCustomFields([
        toggleField('skillsShowTitle', 'Exibir titulo', viewPrefs.skills.showTitle),
        toggleField('skillsShowCategories', 'Exibir categorias', viewPrefs.skills.showCategories),
        selectField('skillsTitleAlign', 'Alinhamento do titulo', viewPrefs.skills.titleAlign),
        selectField('skillsTextAlign', 'Alinhamento do texto', viewPrefs.skills.textAlign),
        ...baseFields,
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
        toggleField('contactShowEmail', 'Exibir email', viewPrefs.contact.showEmail),
        toggleField('contactShowLinkedin', 'Exibir LinkedIn', viewPrefs.contact.showLinkedin),
        toggleField('contactShowGithub', 'Exibir GitHub', viewPrefs.contact.showGithub),
        toggleField('contactShowPhone', 'Exibir telefone', viewPrefs.contact.showPhone),
        field('contactEmail', 'Email', 'text', this.portfolio.contact.email),
        field('contactGithub', 'GitHub', 'url', this.portfolio.contact.github),
        field('contactLinkedin', 'LinkedIn', 'url', this.portfolio.contact.linkedin),
        field('contactPhone', 'Telefone', 'text', this.portfolio.contact.phone || ''),
      ]);
    }

    if (section === 'githubProfile') {
      return withCustomFields([
        toggleField('ghShowLinkedinLink', 'Exibir vinculo LinkedIn', viewPrefs.githubProfile.showLinkedinLink),
        toggleField('ghShowLinkedinExtras', 'Exibir dados do LinkedIn', viewPrefs.githubProfile.showLinkedinExtras),
        toggleField('ghShowLinkedinIcon', 'Exibir icone do LinkedIn', viewPrefs.githubProfile.showLinkedinIcon),
        field('ghName', 'Nome', 'text', this.portfolio.profile.name),
        field('ghHandle', 'Handle', 'text', this.portfolio.profile.handle),
        field('ghLinkedinUrl', 'Vinculo LinkedIn (URL)', 'url', this.linkedInProfileUrl),
        field('ghBio', 'Bio', 'textarea', this.portfolio.profile.bio),
        field('ghProfessionalLabel', 'Label profissional', 'text', this.portfolio.profile.professionalLabel),
        field('ghLinkedinHeadline', 'LinkedIn - headline', 'text', this.portfolio.linkedin.headline),
        field('ghLinkedinActivity', 'LinkedIn - atividade', 'textarea', this.portfolio.linkedin.activity),
        field('ghLinkedinExperience', 'LinkedIn - trajetoria', 'textarea', this.portfolio.linkedin.experience),
        field('ghFollowers', 'Followers', 'text', String(this.portfolio.profile.followers || 0)),
        field('ghFollowing', 'Following', 'text', String(this.portfolio.profile.following || 0)),
        field('ghCompany', 'Empresa', 'text', this.portfolio.profile.company),
        field('ghCompanyUrl', 'URL da empresa', 'url', this.portfolio.profile.companyUrl || ''),
        field('ghLocation', 'Localizacao', 'text', this.portfolio.profile.location),
        field('ghTimezone', 'Fuso horario', 'text', this.portfolio.profile.timezone),
        field('ghWebsite', 'Website', 'url', this.portfolio.profile.website || ''),
        field('ghX', 'X', 'text', this.portfolio.profile.x || ''),
        field('ghLinkedinUser', 'LinkedIn user', 'text', this.portfolio.profile.linkedinUser || ''),
        field('ghLinkedinPath', 'LinkedIn path', 'text', this.portfolio.profile.linkedinPath || ''),
        field('ghAvatarUrl', 'Avatar URL', 'image', this.portfolio.profile.avatarUrl || ''),
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
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.animations.enabled = this.toToggle(value('animEnabled'), viewPrefs.animations.enabled);
      viewPrefs.animations.sectionDurationMs = this.toPositiveNumber(
        value('animSectionDurationMs'),
        viewPrefs.animations.sectionDurationMs
      );
      viewPrefs.animations.cardDurationMs = this.toPositiveNumber(
        value('animCardDurationMs'),
        viewPrefs.animations.cardDurationMs
      );
      viewPrefs.animations.cardStaggerMs = this.toNonNegativeNumber(
        value('animCardStaggerMs'),
        viewPrefs.animations.cardStaggerMs
      );
      viewPrefs.animations.cardHoverLiftPx = this.toNonNegativeNumber(
        value('animCardHoverLiftPx'),
        viewPrefs.animations.cardHoverLiftPx
      );
      viewPrefs.hero.showHeroLinkedin = this.toToggle(value('heroShowLinkedin'), viewPrefs.hero.showHeroLinkedin);
      viewPrefs.hero.showHeroCurriculum = this.toToggle(value('heroShowCurriculum'), viewPrefs.hero.showHeroCurriculum);
      viewPrefs.hero.showProfileGithub = this.toToggle(value('heroShowProfileGithub'), viewPrefs.hero.showProfileGithub);
      viewPrefs.hero.showProfileX = this.toToggle(value('heroShowProfileX'), viewPrefs.hero.showProfileX);
      viewPrefs.hero.showProfileLinkedin = this.toToggle(value('heroShowProfileLinkedin'), viewPrefs.hero.showProfileLinkedin);
      viewPrefs.hero.showProfileWebsite = this.toToggle(value('heroShowProfileWebsite'), viewPrefs.hero.showProfileWebsite);

      this.portfolio.hero.introPrefix = value('introPrefix');
      this.portfolio.profile.name = value('name');
      this.portfolio.hero.typingNames = this.splitCsv(value('typingNames'));
      this.portfolio.hero.subtitleOne = value('subtitleOne');
      this.portfolio.hero.subtitleTwo = value('subtitleTwo');
      this.portfolio.hero.primaryStack = value('primaryStack');
      this.portfolio.hero.aboutRotator = this.splitLines(value('aboutRotator'));
      this.portfolio.profile.bio = value('bio');
      this.portfolio.socialLinks.github = value('heroGithub');
      this.portfolio.socialLinks.linkedin = value('heroLinkedin');
      this.portfolio.curriculum.url = value('heroCurriculum');
      this.portfolio.socialLinks.curriculum = value('heroCurriculum');
      this.portfolio.socialLinks.website = value('heroWebsite');
      this.portfolio.profile.website = value('heroWebsite');
      this.portfolio.socialLinks.x = value('heroX');
      this.portfolio.profile.x = value('heroX');
      this.portfolio.profile.avatarUrl = value('avatarUrl');
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'about') {
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.about.showTitle = this.toToggle(value('aboutShowTitle'), viewPrefs.about.showTitle);
      viewPrefs.about.showSummary = this.toToggle(value('aboutShowSummary'), viewPrefs.about.showSummary);
      viewPrefs.about.showHighlights = this.toToggle(value('aboutShowHighlights'), viewPrefs.about.showHighlights);
      viewPrefs.about.titleAlign = this.toAlignValue(value('aboutTitleAlign'), viewPrefs.about.titleAlign);
      viewPrefs.about.textAlign = this.toAlignValue(value('aboutTextAlign'), viewPrefs.about.textAlign);

      this.portfolio.aboutCard.badge = value('badge');
      this.portfolio.aboutCard.title = value('title');
      this.portfolio.aboutCard.summary = value('summary');

      const highlightIndexes = this.extractAboutHighlightIndexes();
      this.portfolio.aboutCard.highlights = highlightIndexes
        .map((index) => ({
          label: value(`aboutHighlight${index}Label`),
          value: value(`aboutHighlight${index}Value`),
        }))
        .filter((item) => item.label || item.value);

      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'projects') {
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.projects.showTitle = this.toToggle(value('projectsShowTitle'), viewPrefs.projects.showTitle);
      viewPrefs.projects.showSubtitle = this.toToggle(value('projectsShowSubtitle'), viewPrefs.projects.showSubtitle);
      viewPrefs.projects.showDescription = this.toToggle(value('projectsShowDescription'), viewPrefs.projects.showDescription);
      viewPrefs.projects.showTechnology = this.toToggle(value('projectsShowTechnology'), viewPrefs.projects.showTechnology);
      viewPrefs.projects.showImages = this.toToggle(value('projectsShowImages'), viewPrefs.projects.showImages);
      viewPrefs.projects.maxVisibleItems = this.toPositiveNumber(
        value('projectsMaxVisibleItems'),
        viewPrefs.projects.maxVisibleItems
      );

      this.portfolio.projects.title = value('projectsTitle');
      this.portfolio.projects.subtitle = value('projectsSubtitle');
      const indexes = this.extractProjectItemIndexes();
      if (indexes.length) {
        const nextItems = indexes
          .map((index, arrayIndex) => ({
            id:
              this.portfolio?.projects.items[arrayIndex]?.id ||
              this.slugify(value(`projectItem${index}Title`)) ||
              `projeto-${index}`,
            title: value(`projectItem${index}Title`),
            sobre: value(`projectItem${index}Description`),
            tecnologia: value(`projectItem${index}Technology`),
            img: value(`projectItem${index}Image`),
            git: value(`projectItem${index}Github`),
            link: value(`projectItem${index}Live`),
          }))
          .filter((item) => item.title || item.sobre || item.tecnologia || item.img || item.git || item.link);

        this.portfolio.projects.items = nextItems;
      }
      this.persistCustomFields();
      return;
    }

    if (this.homeEditSection === 'skills') {
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.skills.showTitle = this.toToggle(value('skillsShowTitle'), viewPrefs.skills.showTitle);
      viewPrefs.skills.showCategories = this.toToggle(value('skillsShowCategories'), viewPrefs.skills.showCategories);
      viewPrefs.skills.titleAlign = this.toAlignValue(value('skillsTitleAlign'), viewPrefs.skills.titleAlign);
      viewPrefs.skills.textAlign = this.toAlignValue(value('skillsTextAlign'), viewPrefs.skills.textAlign);

      const categoryIndexes = this.extractSkillCategoryIndexes();
      const nextSkills = categoryIndexes
        .map((index) => ({
          name: value(`skillCategory${index}Name`),
          items: this.splitCsv(value(`skillCategory${index}Items`)),
        }))
        .filter((category) => category.name || category.items.length);

      this.portfolio.skills = nextSkills.length
        ? nextSkills
        : [{ name: 'Backend', items: ['Java', 'Spring Boot'] }];
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
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.contact.showEmail = this.toToggle(value('contactShowEmail'), viewPrefs.contact.showEmail);
      viewPrefs.contact.showLinkedin = this.toToggle(value('contactShowLinkedin'), viewPrefs.contact.showLinkedin);
      viewPrefs.contact.showGithub = this.toToggle(value('contactShowGithub'), viewPrefs.contact.showGithub);
      viewPrefs.contact.showPhone = this.toToggle(value('contactShowPhone'), viewPrefs.contact.showPhone);

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
      const viewPrefs = this.ensureViewPreferences();
      viewPrefs.githubProfile.showLinkedinLink = this.toToggle(
        value('ghShowLinkedinLink'),
        viewPrefs.githubProfile.showLinkedinLink
      );
      viewPrefs.githubProfile.showLinkedinExtras = this.toToggle(
        value('ghShowLinkedinExtras'),
        viewPrefs.githubProfile.showLinkedinExtras
      );
      viewPrefs.githubProfile.showLinkedinIcon = this.toToggle(
        value('ghShowLinkedinIcon'),
        viewPrefs.githubProfile.showLinkedinIcon
      );

      this.portfolio.profile.name = value('ghName');
      this.portfolio.profile.handle = value('ghHandle');
      this.portfolio.socialLinks.linkedin = this.normalizeLinkedinUrl(value('ghLinkedinUrl'));
      this.portfolio.profile.bio = value('ghBio');
      this.portfolio.profile.professionalLabel = value('ghProfessionalLabel');
      this.portfolio.linkedin.headline = value('ghLinkedinHeadline');
      this.portfolio.linkedin.activity = value('ghLinkedinActivity');
      this.portfolio.linkedin.experience = value('ghLinkedinExperience');
      this.portfolio.profile.followers = Number(value('ghFollowers')) || 0;
      this.portfolio.profile.following = Number(value('ghFollowing')) || 0;
      this.portfolio.profile.company = value('ghCompany');
      this.portfolio.profile.companyUrl = value('ghCompanyUrl');
      this.portfolio.profile.location = value('ghLocation');
      this.portfolio.profile.timezone = value('ghTimezone');
      this.portfolio.profile.website = value('ghWebsite');
      this.portfolio.profile.x = value('ghX');
      this.portfolio.profile.linkedinUser = value('ghLinkedinUser');
      this.portfolio.profile.linkedinPath = value('ghLinkedinPath');
      this.portfolio.profile.avatarUrl = value('ghAvatarUrl');

      const parsedLinkedin = this.parseLinkedinInfo(this.portfolio.socialLinks.linkedin);
      if (parsedLinkedin.path) {
        this.portfolio.profile.linkedinPath = parsedLinkedin.path;
      }
      if (parsedLinkedin.user) {
        this.portfolio.profile.linkedinUser = parsedLinkedin.user;
      }

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
      .filter((field) => field.isCustom && this.isCustomFieldType(field.type))
      .map((field) => ({
        id: field.id,
        label: (field.label || '').trim(),
        value: (field.value || '').trim(),
        type: field.type as PortfolioCustomCardField['type'],
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

  private isCustomFieldType(type: QuickEditFieldType): type is PortfolioCustomCardField['type'] {
    return type === 'text' || type === 'textarea' || type === 'url' || type === 'image';
  }

  private splitLines(value: string): string[] {
    return (value || '')
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private toToggle(raw: string, fallback: boolean): boolean {
    const value = (raw || '').trim().toLowerCase();
    if (!value) {
      return fallback;
    }
    return ['1', 'true', 'sim', 'yes', 'on'].includes(value);
  }

  private toPositiveNumber(raw: string, fallback: number): number {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(1, Math.round(parsed));
  }

  private toNonNegativeNumber(raw: string, fallback: number): number {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }
    return Math.max(0, Math.round(parsed));
  }

  private toAlignValue(raw: string, fallback: 'left' | 'center' | 'right'): 'left' | 'center' | 'right' {
    const value = (raw || '').trim().toLowerCase();
    if (value === 'left' || value === 'center' || value === 'right') {
      return value;
    }
    return fallback;
  }

  private extractSkillCategoryIndexes(): number[] {
    const indexes = new Set<number>();

    this.quickEditFields.forEach((field) => {
      const match = field.key.match(/^skillCategory(\d+)(Name|Items)$/);
      if (!match?.[1]) {
        return;
      }

      const index = Number(match[1]);
      if (Number.isFinite(index) && index > 0) {
        indexes.add(index);
      }
    });

    return Array.from(indexes).sort((a, b) => a - b);
  }

  private extractAboutHighlightIndexes(): number[] {
    const indexes = new Set<number>();

    this.quickEditFields.forEach((field) => {
      const match = field.key.match(/^aboutHighlight(\d+)(Label|Value)$/);
      if (!match?.[1]) {
        return;
      }

      const index = Number(match[1]);
      if (Number.isFinite(index) && index > 0) {
        indexes.add(index);
      }
    });

    return Array.from(indexes).sort((a, b) => a - b);
  }

  private extractProjectItemIndexes(): number[] {
    const indexes = new Set<number>();

    this.quickEditFields.forEach((field) => {
      const match = field.key.match(/^projectItem(\d+)(Title|Description|Technology|Image|Github|Live)$/);
      if (!match?.[1]) {
        return;
      }

      const index = Number(match[1]);
      if (Number.isFinite(index) && index > 0) {
        indexes.add(index);
      }
    });

    return Array.from(indexes).sort((a, b) => a - b);
  }

  private buildProjectItemFields(index: number, draft: ProjectFieldDraft): QuickEditField[] {
    return [
      {
        id: `projectItem${index}Title`,
        key: `projectItem${index}Title`,
        label: `Projeto ${index} - titulo`,
        type: 'text',
        value: draft.title,
      },
      {
        id: `projectItem${index}Description`,
        key: `projectItem${index}Description`,
        label: `Projeto ${index} - descricao`,
        type: 'textarea',
        value: draft.description,
      },
      {
        id: `projectItem${index}Technology`,
        key: `projectItem${index}Technology`,
        label: `Projeto ${index} - tecnologia`,
        type: 'text',
        value: draft.technology,
      },
      {
        id: `projectItem${index}Image`,
        key: `projectItem${index}Image`,
        label: `Projeto ${index} - imagem`,
        type: 'image',
        value: draft.image,
      },
      {
        id: `projectItem${index}Github`,
        key: `projectItem${index}Github`,
        label: `Projeto ${index} - github`,
        type: 'url',
        value: draft.github,
      },
      {
        id: `projectItem${index}Live`,
        key: `projectItem${index}Live`,
        label: `Projeto ${index} - link publico`,
        type: 'url',
        value: draft.live,
      },
    ];
  }

  private getSectionTitle(section: HomeEditSection): string {
    if (!this.portfolio) {
      return this.getSectionFallbackTitle(section);
    }

    if (section === 'about') {
      return this.portfolio.aboutCard.badge?.trim() || this.getSectionFallbackTitle(section);
    }
    if (section === 'projects') {
      return this.portfolio.projects.title?.trim() || this.getSectionFallbackTitle(section);
    }
    if (section === 'curriculo') {
      return this.portfolio.curriculum.title?.trim() || this.getSectionFallbackTitle(section);
    }
    if (section === 'githubProfile') {
      return this.portfolio.profile.professionalLabel?.trim() || this.getSectionFallbackTitle(section);
    }
    if (section === 'hero') {
      return this.getSectionFallbackTitle(section);
    }
    if (section === 'activity') {
      return 'Resultados';
    }
    if (section === 'experience') {
      return 'Trajetoria';
    }
    if (section === 'certifications') {
      return 'Formacoes e cursos';
    }
    if (section === 'contact') {
      return 'Fale comigo';
    }
    if (section === 'skills') {
      return 'Tecnologias';
    }
    if (section === 'duo') {
      return `Projeto secundario ${this.homeEditDuoIndex + 1}`;
    }

    return this.getSectionFallbackTitle(section);
  }

  private getSectionFallbackTitle(section: HomeEditSection): string {
    const titles: Record<HomeEditSection, string> = {
      hero: 'Hero',
      about: 'Sobre',
      skills: 'Tecnologias',
      projects: 'Projetos',
      experience: 'Trajetoria',
      activity: 'Resultados',
      certifications: 'Certificacoes',
      curriculo: 'Curriculo',
      contact: 'Contato',
      githubProfile: 'Perfil',
      featured: 'Projeto principal',
      duo: 'Projeto secundario',
    };
    return titles[section];
  }

  private ensureHeroInLayout(document: PortfolioDocument): void {
    if (!document.blocks.hero) {
      document.blocks.hero = { enabled: true };
    } else {
      document.blocks.hero.enabled = true;
    }

    const order = Array.isArray(document.layoutOrder) ? [...document.layoutOrder] : [];
    if (!order.includes('hero')) {
      document.layoutOrder = ['hero', ...order];
    }
  }

  private normalizeCurriculumUrl(rawValue: string, document: PortfolioDocument): string {
    const raw = (rawValue || '').trim();
    if (!raw) {
      return '';
    }

    if (/^mailto:|^tel:/i.test(raw)) {
      return '';
    }

    const normalized = /^https?:\/\//i.test(raw)
      ? raw
      : (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw) ? `https://${raw}` : raw);

    if (!/^https?:\/\//i.test(normalized)) {
      return '';
    }

    const socialCandidates = [
      document.socialLinks.linkedin,
      document.socialLinks.github,
      document.socialLinks.x,
    ]
      .map((item) => (item || '').trim())
      .filter(Boolean)
      .map((item) => (/^https?:\/\//i.test(item) ? item : `https://${item}`));

    if (socialCandidates.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      return '';
    }

    return normalized;
  }

  private ensureProjectItem(index: number): void {
    if (!this.portfolio) {
      return;
    }

    while (this.portfolio.projects.items.length <= index) {
      const position = this.portfolio.projects.items.length + 1;
      this.portfolio.projects.items.push({
        id: `projeto-${Date.now()}-${position}`,
        title: `Novo projeto ${position}`,
        img: '',
        sobre: '',
        tecnologia: '',
        git: '',
        link: '',
      });
    }
  }

  private slugify(value: string): string {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private getViewPreferences(): PortfolioViewPreferences {
    return this.mergeViewPreferences(this.portfolio?.viewPreferences);
  }

  private ensureViewPreferences(): PortfolioViewPreferences {
    if (!this.portfolio) {
      return this.createDefaultViewPreferences();
    }

    const merged = this.mergeViewPreferences(this.portfolio.viewPreferences);
    this.portfolio.viewPreferences = merged;
    return merged;
  }

  private mergeViewPreferences(
    incoming?: Partial<PortfolioViewPreferences>
  ): PortfolioViewPreferences {
    const base = this.createDefaultViewPreferences();
    const input = incoming || {};
    return {
      animations: { ...base.animations, ...(input.animations || {}) },
      hero: { ...base.hero, ...(input.hero || {}) },
      about: { ...base.about, ...(input.about || {}) },
      skills: { ...base.skills, ...(input.skills || {}) },
      projects: { ...base.projects, ...(input.projects || {}) },
      contact: { ...base.contact, ...(input.contact || {}) },
      githubProfile: { ...base.githubProfile, ...(input.githubProfile || {}) },
    };
  }

  private createDefaultViewPreferences(): PortfolioViewPreferences {
    return {
      animations: {
        enabled: true,
        sectionDurationMs: 450,
        cardDurationMs: 550,
        cardStaggerMs: 90,
        cardHoverLiftPx: 3,
      },
      hero: {
        showHeroLinkedin: true,
        showHeroCurriculum: true,
        showProfileGithub: true,
        showProfileX: true,
        showProfileLinkedin: true,
        showProfileWebsite: true,
      },
      about: {
        showTitle: true,
        showSummary: true,
        showHighlights: true,
        titleAlign: 'center',
        textAlign: 'center',
      },
      skills: {
        showTitle: true,
        showCategories: true,
        titleAlign: 'center',
        textAlign: 'center',
      },
      projects: {
        showTitle: true,
        showSubtitle: true,
        showDescription: true,
        showTechnology: true,
        showImages: true,
        maxVisibleItems: 50,
      },
      contact: {
        showEmail: true,
        showLinkedin: true,
        showGithub: true,
        showPhone: true,
      },
      githubProfile: {
        showLinkedinLink: true,
        showLinkedinExtras: true,
        showLinkedinIcon: true,
      },
    };
  }

  private normalizeLinkedinUrl(value: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '';
    }
    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }
    if (raw.startsWith('www.')) {
      return `https://${raw}`;
    }
    if (raw.includes('linkedin.com/')) {
      return `https://${raw}`;
    }
    return `https://www.linkedin.com/in/${raw.replace(/^@/, '')}`;
  }

  private parseLinkedinInfo(value: string): { path: string; user: string } {
    const normalized = this.normalizeLinkedinUrl(value);
    if (!normalized) {
      return { path: '', user: '' };
    }

    const match = normalized.match(/linkedin\.com\/([^?#]+)/i);
    const path = match?.[1]?.replace(/^\/+/, '').replace(/\/+$/, '') || '';
    const userMatch = path.match(/^(?:in|company)\/([^/?#]+)/i);
    const user = userMatch?.[1] || '';
    return { path, user };
  }

  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeoutMs)
      ),
    ]);
  }

  private buildEmergencyPortfolio(username: string): PortfolioDocument {
    return {
      schemaVersion: 1,
      username: (username || 'jailsonr12').toLowerCase(),
      sourceMode: 'manual',
      updatedAt: new Date().toISOString(),
      socialLinks: {
        github: `https://github.com/${username || 'jailsonr12'}`,
        linkedin: 'https://www.linkedin.com/',
        x: '',
        website: '',
        curriculum: this.fallbackCurriculumUrl,
      },
      blocks: {
        hero: { enabled: true },
        about: { enabled: true },
        projects: { enabled: true },
        curriculo: { enabled: false },
        activity: { enabled: false },
        experience: { enabled: false },
        skills: { enabled: false },
        githubProfile: { enabled: false },
        certifications: { enabled: false },
        contact: { enabled: false },
      },
      layoutOrder: [
        'hero',
        'about',
        'projects',
      ],
      hero: {
        introPrefix: 'Oi, eu sou',
        typingNames: [username || 'jailsonr12'],
        subtitleOne: 'DESENVOLVEDOR',
        subtitleTwo: 'FULL-STACK',
        primaryStack: 'Java | Spring Boot | SQL | Docker',
        aboutRotator: ['Construindo software com foco em qualidade.'],
        heroAboutTitle: 'Sobre mim',
        heroAboutDescription: 'Modo seguro carregado com dados padrao.',
        contacts: [],
      },
      profile: {
        name: username || 'jailsonr12',
        handle: username || 'jailsonr12',
        bio: 'Perfil carregado em modo seguro.',
        professionalLabel: 'Dev',
        followers: 0,
        following: 0,
        company: '',
        companyUrl: '',
        location: '',
        timezone: 'UTC',
        website: '',
        x: '',
        linkedinUser: '',
        linkedinPath: '',
        avatarUrl: `https://github.com/${username || 'jailsonr12'}.png`,
      },
      aboutCard: {
        badge: 'Sobre',
        title: 'Perfil profissional',
        summary: 'Dados de fallback para manter o portfolio funcional.',
        pillars: [],
        highlights: [],
        timeline: [],
      },
      linkedin: {
        headline: 'Desenvolvedor',
        about: 'Resumo profissional.',
        activity: 'Atividade tecnica.',
        experience: 'Trajetoria profissional.',
      },
      curriculum: {
        title: 'Curriculo',
        description: 'Abra o curriculo no link abaixo.',
        url: this.fallbackCurriculumUrl,
      },
      projects: {
        title: 'Projetos',
        subtitle: 'Destaques',
        items: [],
      },
      skills: [{ name: 'Backend', items: ['Java', 'Spring Boot'] }],
      experience: [
        {
          company: 'Trajetoria profissional',
          role: 'Desenvolvedor',
          period: 'Atual',
          bullets: ['Detalhes da experiencia principal.'],
          technologies: ['Java', 'SQL'],
        },
      ],
      caseStudies: [
        {
          title: 'Resultado tecnico',
          summary: 'Analise tecnica de um problema real.',
          decisions: ['Decisao arquitetural principal'],
        },
      ],
      certifications: [{ name: 'Curso relevante', issuer: 'Plataforma', year: '2026' }],
      contact: {
        email: 'contato@exemplo.com',
        github: `https://github.com/${username || 'jailsonr12'}`,
        linkedin: 'https://www.linkedin.com/',
        formEnabled: false,
      },
      customCardFields: {},
      viewPreferences: this.createDefaultViewPreferences(),
    };
  }

  private observeMenuSections(): void {
    if (!this.homeRoot?.nativeElement) {
      return;
    }

    this.menuMutationObserver?.disconnect();
    this.menuMutationObserver = new MutationObserver(() => {
      if (this.isMenuRefreshScheduled) {
        return;
      }

      this.isMenuRefreshScheduled = true;
      setTimeout(() => {
        this.isMenuRefreshScheduled = false;
        this.refreshHomeMenu();
        this.onWindowScroll();
      }, 0);
    });

    this.menuMutationObserver.observe(this.homeRoot.nativeElement, {
      childList: true,
      subtree: false,
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
