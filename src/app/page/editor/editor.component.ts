import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PortfolioDocument, PortfolioProject } from '../../models/portfolio-data.model';
import { PortfolioBlockKey } from '../../models/portfolio-layout.model';
import { PortfolioDataService } from '../../services/portfolio-data.service';

type EditorTab = 'geral' | 'hero' | 'sobre' | 'links' | 'projetos' | 'layout' | 'json';
interface EditorBlockDefinition {
  key: PortfolioBlockKey;
  label: string;
  description: string;
  editorTab: EditorTab;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  username = 'jailsonr12';
  portfolio?: PortfolioDocument;
  loading = true;
  saving = false;
  message = '';
  error = '';
  jsonDraft = '';
  activeTab: EditorTab = 'geral';
  normalizedLinksCount = 0;
  draggedBlockIndex: number | null = null;
  inlineEditingBlock: PortfolioBlockKey | null = null;

  readonly tabs: Array<{ id: EditorTab; label: string }> = [
    { id: 'geral', label: 'Geral' },
    { id: 'hero', label: 'Hero' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'links', label: 'Links' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'layout', label: 'Layout' },
    { id: 'json', label: 'JSON' },
  ];

  readonly blockKeys: PortfolioBlockKey[] = [
    'hero',
    'about',
    'projects',
    'contact',
    'githubProfile',
  ];

  readonly blockDefinitions: EditorBlockDefinition[] = [
    { key: 'hero', label: 'Hero', description: 'Capa e apresentacao inicial.', editorTab: 'hero' },
    { key: 'about', label: 'Sobre', description: 'Resumo profissional e badges.', editorTab: 'sobre' },
    {
      key: 'projects',
      label: 'Projetos',
      description: 'Lista de projetos e destaques.',
      editorTab: 'projetos',
    },
    {
      key: 'contact',
      label: 'Contato',
      description: 'Dados e canais de contato.',
      editorTab: 'links',
    },
    {
      key: 'githubProfile',
      label: 'GitHub Profile',
      description: 'Infos de perfil e cards relacionados.',
      editorTab: 'geral',
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly portfolioDataService: PortfolioDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.username = (this.route.snapshot.paramMap.get('username') || 'jailsonr12').toLowerCase();
    await this.load();
  }

  get firstProject(): PortfolioProject | undefined {
    return this.portfolio?.projects.items[0];
  }

  get layoutOrderText(): string {
    return (this.portfolio?.layoutOrder || []).join(', ');
  }

  set layoutOrderText(value: string) {
    if (!this.portfolio) {
      return;
    }

    this.portfolio.layoutOrder = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => this.blockKeys.includes(item as PortfolioBlockKey)) as PortfolioBlockKey[];
  }

  get orderedLayoutBlocks(): PortfolioBlockKey[] {
    if (!this.portfolio) {
      return [];
    }

    const ordered = this.portfolio.layoutOrder.filter((key) => this.blockKeys.includes(key));
    this.blockKeys.forEach((key) => {
      if (!ordered.includes(key)) {
        ordered.push(key);
      }
    });
    return ordered;
  }

  get availableBlocksToInsert(): PortfolioBlockKey[] {
    if (!this.portfolio) {
      return [];
    }

    return this.blockKeys.filter((key) => !this.portfolio?.layoutOrder.includes(key));
  }

  getBlockLabel(key: PortfolioBlockKey): string {
    return this.blockDefinitions.find((item) => item.key === key)?.label || key;
  }

  getBlockDescription(key: PortfolioBlockKey): string {
    return this.blockDefinitions.find((item) => item.key === key)?.description || '';
  }

  getBlockEditorTab(key: PortfolioBlockKey): EditorTab {
    return this.blockDefinitions.find((item) => item.key === key)?.editorTab || 'layout';
  }

  selectTab(tab: EditorTab): void {
    this.activeTab = tab;
  }

  editBlock(key: PortfolioBlockKey): void {
    this.activeTab = this.getBlockEditorTab(key);
    this.message = `Editando bloco "${this.getBlockLabel(key)}".`;
    this.error = '';
  }

  toggleInlineEditor(key: PortfolioBlockKey): void {
    this.inlineEditingBlock = this.inlineEditingBlock === key ? null : key;
  }

  isInlineEditorOpen(key: PortfolioBlockKey): boolean {
    return this.inlineEditingBlock === key;
  }

  insertBlockInLayout(key: PortfolioBlockKey): void {
    if (!this.portfolio || this.portfolio.layoutOrder.includes(key)) {
      return;
    }

    this.portfolio.layoutOrder.push(key);
    this.message = `Bloco "${this.getBlockLabel(key)}" inserido na ordem da pagina.`;
    this.error = '';
  }

  removeBlockFromLayout(key: PortfolioBlockKey): void {
    if (!this.portfolio) {
      return;
    }

    this.portfolio.layoutOrder = this.portfolio.layoutOrder.filter((item) => item !== key);
    this.message = `Bloco "${this.getBlockLabel(key)}" removido da ordem da pagina.`;
    this.error = '';
  }

  moveBlockByOffset(index: number, offset: number): void {
    if (!this.portfolio) {
      return;
    }

    const target = index + offset;
    if (target < 0 || target >= this.portfolio.layoutOrder.length) {
      return;
    }

    this.moveBlock(index, target);
  }

  onBlockDragStart(index: number): void {
    this.draggedBlockIndex = index;
  }

  onBlockDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onBlockDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.draggedBlockIndex === null || this.draggedBlockIndex === index) {
      this.onBlockDragEnd();
      return;
    }

    this.moveBlock(this.draggedBlockIndex, index);
    this.onBlockDragEnd();
  }

  onBlockDragEnd(): void {
    this.draggedBlockIndex = null;
  }

  isBlockInLayout(key: PortfolioBlockKey): boolean {
    return this.portfolio?.layoutOrder.includes(key) || false;
  }

  getBlockLayoutIndex(key: PortfolioBlockKey): number {
    if (!this.portfolio) {
      return -1;
    }
    return this.portfolio.layoutOrder.indexOf(key);
  }

  canMoveBlockKeyUp(key: PortfolioBlockKey): boolean {
    const index = this.getBlockLayoutIndex(key);
    return index > 0;
  }

  moveBlockKeyUp(key: PortfolioBlockKey): void {
    const index = this.getBlockLayoutIndex(key);
    if (index <= 0) {
      return;
    }
    this.moveBlock(index, index - 1);
  }

  addTypingName(): void {
    this.portfolio?.hero.typingNames.push('Novo nome');
  }

  removeTypingName(index: number): void {
    this.portfolio?.hero.typingNames.splice(index, 1);
  }

  addAboutPhrase(): void {
    this.portfolio?.hero.aboutRotator.push('Nova frase de apresentacao');
  }

  removeAboutPhrase(index: number): void {
    this.portfolio?.hero.aboutRotator.splice(index, 1);
  }

  addHeroContact(): void {
    this.portfolio?.hero.contacts.push({
      label: 'Novo contato',
      url: '',
      icon: '🔗',
      iconType: 'emoji',
    });
  }

  removeHeroContact(index: number): void {
    this.portfolio?.hero.contacts.splice(index, 1);
  }

  addProject(): void {
    if (!this.portfolio) {
      return;
    }

    const id = `projeto-${Date.now()}`;
    this.portfolio.projects.items.push({
      id,
      title: 'Novo projeto',
      img: '',
      sobre: '',
      tecnologia: '',
      git: '',
      link: '',
    });
  }

  removeProject(index: number): void {
    this.portfolio?.projects.items.splice(index, 1);
  }

  async save(): Promise<void> {
    if (!this.portfolio) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.message = '';

    try {
      this.normalizedLinksCount = this.sanitizeAllLinks();
      this.portfolio.sourceMode = 'manual';
      this.portfolio = this.portfolioDataService.save(this.portfolio);
      this.refreshJsonDraft();
      this.message =
        this.normalizedLinksCount > 0
          ? `Alteracoes salvas com sucesso. ${this.normalizedLinksCount} links foram ajustados automaticamente.`
          : 'Alteracoes salvas com sucesso.';
    } catch {
      this.error = 'Nao foi possivel salvar agora.';
    } finally {
      this.saving = false;
    }
  }

  async resetFromApi(): Promise<void> {
    if (!this.portfolio) {
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';
    try {
      this.portfolio = await this.portfolioDataService.refreshFromGitHub(this.portfolio);
      this.refreshJsonDraft();
      this.message = 'Dados atualizados via API do GitHub.';
    } catch {
      this.error = 'Falha ao atualizar da API.';
    } finally {
      this.loading = false;
    }
  }

  applyJsonDraft(): void {
    if (!this.portfolio) {
      return;
    }

    this.error = '';
    this.message = '';

    try {
      const parsed = JSON.parse(this.jsonDraft) as PortfolioDocument;
      this.portfolio = {
        ...parsed,
        username: this.username,
      };
      this.message = 'JSON aplicado no editor.';
    } catch {
      this.error = 'JSON invalido. Corrija o formato antes de aplicar.';
    }
  }

  refreshJsonDraft(): void {
    if (!this.portfolio) {
      return;
    }

    this.jsonDraft = JSON.stringify(this.portfolio, null, 2);
  }

  autoFixLinks(): void {
    if (!this.portfolio) {
      return;
    }

    this.normalizedLinksCount = this.sanitizeAllLinks();
    this.message =
      this.normalizedLinksCount > 0
        ? `${this.normalizedLinksCount} links foram ajustados automaticamente.`
        : 'Nenhum link precisou de ajuste.';
    this.error = '';
  }

  private sanitizeAllLinks(): number {
    if (!this.portfolio) {
      return 0;
    }

    let changes = 0;
    const social = this.portfolio.socialLinks;
    const curriculum = this.portfolio.curriculum;

    const apply = (current: string | undefined, next: string): string => {
      const oldValue = (current || '').trim();
      if (oldValue !== next) {
        changes += 1;
      }
      return next;
    };

    social.github = apply(social.github, this.normalizeUrl(social.github, 'github'));
    social.linkedin = apply(social.linkedin, this.normalizeUrl(social.linkedin, 'linkedin'));
    social.x = apply(social.x, this.normalizeUrl(social.x, 'x'));
    social.website = apply(social.website, this.normalizeUrl(social.website, 'website'));
    social.curriculum = apply(social.curriculum, this.normalizeUrl(social.curriculum, 'generic'));
    curriculum.url = apply(curriculum.url, this.normalizeUrl(curriculum.url, 'generic'));

    this.portfolio.profile.companyUrl = apply(
      this.portfolio.profile.companyUrl,
      this.normalizeUrl(this.portfolio.profile.companyUrl, 'generic')
    );
    this.portfolio.profile.website = apply(
      this.portfolio.profile.website,
      this.normalizeUrl(this.portfolio.profile.website, 'website')
    );

    this.portfolio.hero.contacts = this.portfolio.hero.contacts.map((contact) => ({
      ...contact,
      url: apply(contact.url, this.normalizeUrl(contact.url, 'generic')),
    }));

    this.portfolio.projects.items = this.portfolio.projects.items.map((project) => ({
      ...project,
      git: apply(project.git || '', this.normalizeUrl(project.git || '', 'github')),
      link: apply(project.link || '', this.normalizeUrl(project.link || '', 'generic')),
      img: apply(project.img, this.normalizeAssetOrUrl(project.img)),
    }));

    return changes;
  }

  private normalizeUrl(value: string, type: 'github' | 'linkedin' | 'x' | 'website' | 'generic'): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '';
    }

    if (raw.startsWith('./assets/')) {
      return raw;
    }

    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }

    if (type === 'github') {
      if (/^@?[a-z0-9-]+$/i.test(raw)) {
        return `https://github.com/${raw.replace(/^@/, '')}`;
      }
      if (/github\.com\//i.test(raw)) {
        return `https://${raw.replace(/^https?:\/\//i, '')}`;
      }
    }

    if (type === 'linkedin') {
      if (/^in\/.+/i.test(raw)) {
        return `https://www.linkedin.com/${raw}`;
      }
      if (/^[a-z0-9-]+$/i.test(raw)) {
        return `https://www.linkedin.com/in/${raw}`;
      }
      if (/linkedin\.com\//i.test(raw)) {
        return `https://${raw.replace(/^https?:\/\//i, '')}`;
      }
    }

    if (type === 'x') {
      const handle = raw.replace(/^@/, '');
      if (/^[a-z0-9_]+$/i.test(handle)) {
        return `https://x.com/${handle}`;
      }
      if (/x\.com\//i.test(raw)) {
        return `https://${raw.replace(/^https?:\/\//i, '')}`;
      }
    }

    if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return `https://${raw}`;
    }

    if (type === 'website' || type === 'generic') {
      return raw;
    }

    return raw;
  }

  private normalizeAssetOrUrl(value: string): string {
    const raw = (value || '').trim();
    if (!raw) {
      return '';
    }
    if (raw.startsWith('./assets/') || /^https?:\/\//i.test(raw)) {
      return raw;
    }
    if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return `https://${raw}`;
    }
    return raw;
  }

  private async load(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.portfolio = await this.portfolioDataService.load(this.username);
      this.refreshJsonDraft();
    } catch {
      this.error = 'Falha ao carregar os dados do portfolio.';
    } finally {
      this.loading = false;
    }
  }

  private moveBlock(from: number, to: number): void {
    if (!this.portfolio) {
      return;
    }

    const updated = [...this.portfolio.layoutOrder];
    const [moved] = updated.splice(from, 1);
    if (!moved) {
      return;
    }
    updated.splice(to, 0, moved);
    this.portfolio.layoutOrder = updated;
    this.message = 'Ordem dos blocos atualizada.';
    this.error = '';
  }
}
