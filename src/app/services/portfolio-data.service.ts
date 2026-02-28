import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PortfolioDocument } from '../models/portfolio-data.model';
import { GitHubProfileService } from './github-profile.service';
import { PortfolioRepositoryService } from './portfolio-repository.service';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  constructor(
    private readonly gitHubProfileService: GitHubProfileService,
    private readonly repository: PortfolioRepositoryService
  ) {}

  async load(username: string): Promise<PortfolioDocument> {
    const existing = this.repository.get(username);
    if (existing) {
      return this.normalizeDocument(existing, username);
    }

    const created = await this.buildDefaultDocument(username);
    this.repository.save(created);
    return created;
  }

  save(document: PortfolioDocument): PortfolioDocument {
    const normalizedDocument = this.normalizeDocument(document, document.username);
    const normalized: PortfolioDocument = {
      ...normalizedDocument,
      username: normalizedDocument.username.toLowerCase(),
      updatedAt: new Date().toISOString(),
    };
    this.repository.save(normalized);
    return normalized;
  }

  async refreshFromGitHub(document: PortfolioDocument): Promise<PortfolioDocument> {
    const hydrated = await this.hydrateFromGitHub(this.normalizeDocument(document, document.username));
    this.repository.save(hydrated);
    return hydrated;
  }

  private async buildDefaultDocument(username: string): Promise<PortfolioDocument> {
    const base = this.defaultDocument(username);
    return this.hydrateFromGitHub(base);
  }

  private async hydrateFromGitHub(document: PortfolioDocument): Promise<PortfolioDocument> {
    if (!document.socialLinks.github) {
      return document;
    }

    const githubUsername = this.extractGithubUsername(document.socialLinks.github) || document.username;
    if (!githubUsername) {
      return document;
    }

    try {
      const profile = await firstValueFrom(this.gitHubProfileService.getProfile(githubUsername));
      const next: PortfolioDocument = {
        ...document,
        profile: {
          ...document.profile,
          name: document.profile.name || profile.name || githubUsername,
          handle: document.profile.handle || profile.login || githubUsername,
          bio: document.profile.bio || profile.bio || document.profile.bio,
          followers: profile.followers ?? document.profile.followers,
          following: profile.following ?? document.profile.following,
          company: document.profile.company || profile.company || document.profile.company,
          companyUrl:
            document.profile.companyUrl ||
            (profile.company?.startsWith('@')
              ? `https://github.com/${profile.company.replace('@', '')}`
              : document.profile.companyUrl),
          location: document.profile.location || profile.location || document.profile.location,
          website: document.profile.website || profile.blog || document.profile.website,
          x:
            document.profile.x ||
            (profile.twitter_username ? `@${profile.twitter_username}` : document.profile.x),
          avatarUrl: profile.avatar_url || document.profile.avatarUrl,
        },
        socialLinks: {
          ...document.socialLinks,
          github: profile.html_url || document.socialLinks.github,
          website: document.socialLinks.website || profile.blog || '',
        },
      };

      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      return document;
    }
  }

  private defaultDocument(username: string): PortfolioDocument {
    const normalized = username.toLowerCase();
    return {
      schemaVersion: 1,
      username: normalized,
      sourceMode: 'api',
      updatedAt: new Date().toISOString(),
      socialLinks: {
        github: `https://github.com/${normalized}`,
        linkedin: 'https://www.linkedin.com/',
        x: 'https://x.com/',
        website: '',
        curriculum:
          'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link',
      },
      blocks: {
        hero: { enabled: true },
        about: { enabled: true },
        projects: { enabled: true },
        skills: { enabled: true },
        experience: { enabled: true },
        activity: { enabled: true },
        curriculo: { enabled: true },
        githubProfile: { enabled: true },
        certifications: { enabled: true },
        contact: { enabled: true },
      },
      layoutOrder: [
        'hero',
        'about',
        'skills',
        'projects',
        'experience',
        'activity',
        'certifications',
        'curriculo',
        'contact',
      ],
      hero: {
        introPrefix: 'Oi, me chamo',
        typingNames: [normalized, `${normalized} dev`, `${normalized} full-stack`],
        subtitleOne: 'DESENVOLVEDOR',
        subtitleTwo: 'FULL-STACK',
        primaryStack: 'Angular • TypeScript • Node.js • Java • MySQL',
        aboutRotator: [
          'Construindo portfolios editaveis para devs compartilharem seus projetos com URL propria.',
          'Foco em interfaces limpas, performance e evolucao continua.',
        ],
        heroAboutTitle: 'Sobre mim',
        heroAboutDescription:
          'Desenvolvedor focado em criar experiencias web bonitas, rapidas e com arquitetura preparada para escalar.',
        contacts: [
          {
            label: 'LinkedIn',
            url: 'https://www.linkedin.com/in/jailsonroth/',
            icon: '💼',
            iconType: 'emoji',
          },
          {
            label: 'Curriculo',
            url: '',
            icon: '📄',
            iconType: 'emoji',
          },
          {
            label: 'Site',
            url: 'https://www.jrweb.com.br/',
            icon: '🌐',
            iconType: 'emoji',
          },
        ],
      },
      profile: {
        name: normalized,
        handle: normalized,
        bio: 'Desenvolvedor em evolucao constante.',
        professionalLabel: 'Professional Profile',
        followers: 0,
        following: 0,
        company: '',
        companyUrl: '',
        location: 'Brazil',
        timezone: this.getTimezoneLabel(),
        website: '',
        x: '',
        linkedinUser: '',
        linkedinPath: '',
        avatarUrl: `https://github.com/${normalized}.png`,
      },
      aboutCard: {
        badge: 'Sobre mim',
        title: 'Transformo ideias em produtos web claros, rapidos e escalaveis',
        summary:
          'Sou desenvolvedor Full Stack com foco em front-end moderno, arquitetura evolutiva e experiencia do usuario. Gosto de construir interfaces bonitas e funcionais, com codigo organizado para crescer sem retrabalho.',
        pillars: [
          {
            title: 'Visao de produto',
            description:
              'Cada tela e pensada para resolver um problema real e entregar valor para quem usa.',
          },
          {
            title: 'Codigo sustentavel',
            description:
              'Componentizacao, padronizacao e boas praticas para manter o projeto simples de evoluir.',
          },
          {
            title: 'Performance e qualidade',
            description:
              'Prioridade para responsividade, acessibilidade e fluidez em desktop e mobile.',
          },
        ],
        highlights: [
          { label: 'Especialidade', value: 'Angular + TypeScript' },
          { label: 'Atuacao', value: 'Full Stack e UI' },
          { label: 'Diferencial', value: 'Layout clean e escalavel' },
        ],
        timeline: [
          {
            period: 'Hoje',
            text: 'Criando um portfolio publico editavel para desenvolvedores compartilharem projetos com identidade propria.',
          },
          {
            period: 'Experiencia recente',
            text: 'Atuacao em desenvolvimento, QA e DevOps com foco em qualidade de entrega e melhoria continua.',
          },
          {
            period: 'Proximo passo',
            text: 'Evoluir o produto com recursos de personalizacao avancada, publicacao e escala.',
          },
        ],
      },
      linkedin: {
        headline: 'Desenvolvedor Full Stack | Angular | TypeScript',
        about:
          'Profissional focado em criar interfaces modernas, organizadas e com boa experiencia para quem utiliza.',
        activity: 'Compartilhando evolucao tecnica, projetos e aprendizados em desenvolvimento web.',
        experience: 'Atuacao em desenvolvimento, QA e DevOps com foco em qualidade de entrega.',
      },
      curriculum: {
        title: 'Curriculo',
        description: 'Adicione um link de curriculo para visualizacao e download.',
        url: 'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link',
      },
      projects: {
        title: 'Projetos',
        subtitle: 'Selecao dos trabalhos em destaque',
        items: [
          {
            id: 'primeiro-portfolio',
            title: 'Primeiro Portfolio',
            img: './assets/jailsonr12.github.io_portfolio_.png',
            sobre: 'Primeira versao do portfolio.',
            tecnologia: 'HTML, CSS, JavaScript',
            git: 'https://github.com/usuario/projeto1',
            link: 'https://portfolio-brown-seven-63.vercel.app/',
          },
          {
            id: 'projeto-devs2blu',
            title: 'Projeto final +Devs2Blu 2022',
            img: './assets/zelo_br.png',
            sobre: 'Sistema para inovar as ouvidorias.',
            tecnologia: 'C#, TypeScript, Angular, HTML, CSS, MySQL',
            git: 'https://github.com/more-devs-2-blu/code-go?tab=readme-ov-file',
            link: 'https://www.youtube.com/watch?v=_BxGygkm3Lc&t=6s',
          },
          {
            id: 'projeto-valorant',
            title: 'Projeto Valorant',
            img: './assets/inicio_vava.png',
            sobre: 'Treinando habilidades para reproduzir o design criado.',
            tecnologia: 'HTML, CSS',
            git: 'https://github.com/Jailsonr12/vava',
            link: 'https://www.figma.com/file/2YUQamnOmVTKvivDOFyuBr/vava',
          },
          {
            id: 'site-totoro',
            title: 'Site Do Totoro',
            img: './assets/site_do_totoro.png',
            sobre:
              'Consumindo API sobre o Studio Ghibli, com detalhes e trailers dos filmes.',
            tecnologia: 'HTML, CSS, JS',
            git: 'https://github.com/Jailsonr12/siteDoTotoro/tree/master',
            link: 'https://site-do-totoro.vercel.app/home.html',
          },
          {
            id: 'csgo',
            title: 'CSGO da Depressao',
            img: './assets/site_cs_go.png',
            sobre: 'Site colaborativo sobre o tema CSGO.',
            tecnologia: 'HTML, CSS, JS',
            git: 'https://github.com/Jailsonr12/Site_CsGo/tree/master',
            link: 'https://site-cs-go.vercel.app/',
          },
        ],
      },
      skills: [
        { name: 'Backend', items: ['Java', 'Spring Boot', 'REST', 'JPA'] },
        { name: 'Banco', items: ['PostgreSQL', 'SQL'] },
        { name: 'DevOps', items: ['Docker', 'Linux/WSL', 'CI/CD'] },
        { name: 'Qualidade', items: ['Testes', 'Logs', 'Validacoes', 'QA mindset'] },
        { name: 'Ferramentas', items: ['Git', 'IntelliJ', 'Postman'] },
      ],
      experience: [
        {
          company: 'Empresa atual',
          role: 'Dev Backend Java',
          period: '2024 - Atual',
          bullets: [
            'Desenvolvimento de APIs REST com foco em performance.',
            'Evolucao de qualidade com logs, testes e rastreabilidade.',
            'Integracoes entre sistemas e suporte a deploy.',
          ],
          technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        },
      ],
      caseStudies: [
        {
          title: 'Como resolvi rastreio de erros em producao',
          summary: 'Padronizacao de logs e correlacao para acelerar investigacao.',
          decisions: [
            'Padrao unico de logs por request',
            'IDs de correlacao em ponta a ponta',
            'Alertas com contexto tecnico',
          ],
        },
      ],
      certifications: [
        { name: 'Spring Boot Essentials', issuer: 'Curso Online', year: '2024' },
        { name: 'SQL para Back-end', issuer: 'Curso Online', year: '2023' },
      ],
      contact: {
        email: 'seuemail@dominio.com',
        github: `https://github.com/${normalized}`,
        linkedin: 'https://www.linkedin.com/',
        phone: '',
        formEnabled: false,
      },
    };
  }

  private normalizeDocument(input: Partial<PortfolioDocument>, username: string): PortfolioDocument {
    const base = this.defaultDocument(username);
    const legacyAboutTitle = 'Construo experiencias web que conectam negocio e codigo';
    const legacyAboutSummary =
      'Projeto de portfolio pensado para devs editarem conteudo completo sem quebrar layout.';

    const mergedAbout = {
      ...base.aboutCard,
      ...(input.aboutCard || {}),
      pillars: input.aboutCard?.pillars?.length ? input.aboutCard.pillars : base.aboutCard.pillars,
      highlights: input.aboutCard?.highlights?.length
        ? input.aboutCard.highlights
        : base.aboutCard.highlights,
      timeline: input.aboutCard?.timeline?.length ? input.aboutCard.timeline : base.aboutCard.timeline,
    };

    const mergedProfile = { ...base.profile, ...(input.profile || {}) };
    const mergedLinkedin = { ...base.linkedin, ...(input.linkedin || {}) };
    if (!mergedLinkedin.about?.trim()) {
      mergedLinkedin.about = mergedProfile.bio || base.linkedin.about;
    }

    const shouldUpgradeLegacyAbout =
      !input.aboutCard ||
      input.aboutCard.title === legacyAboutTitle ||
      input.aboutCard.summary === legacyAboutSummary;

    return {
      ...base,
      ...input,
      socialLinks: { ...base.socialLinks, ...(input.socialLinks || {}) },
      blocks: { ...base.blocks, ...(input.blocks || {}) },
      layoutOrder: input.layoutOrder?.length ? input.layoutOrder : base.layoutOrder,
      hero: {
        ...base.hero,
        ...(input.hero || {}),
        typingNames: input.hero?.typingNames?.length ? input.hero.typingNames : base.hero.typingNames,
        aboutRotator: input.hero?.aboutRotator?.length ? input.hero.aboutRotator : base.hero.aboutRotator,
        contacts: input.hero?.contacts?.length ? input.hero.contacts : base.hero.contacts,
      },
      profile: mergedProfile,
      aboutCard: shouldUpgradeLegacyAbout ? base.aboutCard : mergedAbout,
      linkedin: mergedLinkedin,
      curriculum: { ...base.curriculum, ...(input.curriculum || {}) },
      projects: {
        ...base.projects,
        ...(input.projects || {}),
        items: input.projects?.items?.length ? input.projects.items : base.projects.items,
      },
      skills: input.skills?.length ? input.skills : base.skills,
      experience: input.experience?.length ? input.experience : base.experience,
      caseStudies: input.caseStudies?.length ? input.caseStudies : base.caseStudies,
      certifications: input.certifications?.length ? input.certifications : base.certifications,
      contact: { ...base.contact, ...(input.contact || {}) },
      customCardFields: input.customCardFields || base.customCardFields,
      username: (input.username || username || base.username).toLowerCase(),
      sourceMode: input.sourceMode || base.sourceMode,
      schemaVersion: input.schemaVersion || base.schemaVersion,
      updatedAt: input.updatedAt || base.updatedAt,
    };
  }

  private extractGithubUsername(url: string): string {
    const match = url.match(/github\.com\/([^/?#]+)/i);
    return (match?.[1] || '').trim();
  }

  private getTimezoneLabel(): string {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const signal = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const minutes = String(abs % 60).padStart(2, '0');
    return `UTC ${signal}${hours}:${minutes}`;
  }
}
