import { Component } from '@angular/core';

// Estrutura de um projeto exibido na lista
export interface Projeto {
  title: string;
  img: string;
  tipo: string;        // Pessoal, Desafio técnico, Curso, Cliente, Estudo
  ano: string;
  resumo: string;      // uma ou duas frases: o que é
  destaques: string[]; // o que eu fiz e o que isso mostra
  tecnologias: string[];
  git?: string;
  link?: string;
}

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss']
})
export class ApresentacaoComponent {

  projetos: Projeto[] = [
    {
      title: 'Jajá News IA',
      img: './assets/jaja_news_ia.png',
      tipo: 'Pessoal',
      ano: '2025 – 2026',
      resumo: 'Pesquisa notícias com IA rodando na minha máquina e transforma em vídeos curtos verticais, com fonte em cada afirmação.',
      destaques: [
        'Pipeline que salva o estado de cada etapa: se algo falha, retoma de onde parou.',
        'Cada chamada à IA fica registrada (prompt, modelo, entrada e saída) para auditar depois.',
        'Narração, legendas por palavra, imagens e vídeo final gerados localmente, sem serviço pago.',
      ],
      tecnologias: ['Java 25', 'Spring Boot', 'PostgreSQL', 'Docker', 'Ollama', 'Whisper', 'FFmpeg'],
    },
    {
      title: 'Jajá Estuda',
      img: './assets/jaja_estuda.png',
      tipo: 'Pessoal',
      ano: '2026',
      resumo: 'Escola particular com IA para quem tem dislexia ou TDAH. Nasceu da minha própria forma de estudar.',
      destaques: [
        'A IA entrevista a pessoa, lê o edital e monta o plano buscando fonte oficial primeiro.',
        'O simulado vira revisão a partir dos erros. Evolução sem ranking, ofensiva ou vidas.',
        'Banco sem porta exposta, migração separada do backend e proxy de saída com lista fechada de sites.',
        'Em breve em jajaestuda.com.br.',
      ],
      tecnologias: ['Java 25', 'Spring Boot', 'PostgreSQL', 'TypeScript', 'Docker Compose', 'Ollama', 'nginx'],
    },
    {
      title: 'HoverTraduz',
      img: './assets/hovertraduz.png',
      tipo: 'Pessoal',
      ano: '2026',
      resumo: 'Extensão Chrome que traduz texto ao passar o mouse e mostra o preço convertido ao lado, sem mexer na página.',
      destaques: [
        'Resolve uma dor minha: ler e comparar preços em sites em outros idiomas.',
        'Cache de tradução em IndexedDB por 7 dias e cotação guardada por 30 minutos, para não repetir chamadas.',
        'Publicada na Chrome Web Store, com política de privacidade aqui no site.',
      ],
      tecnologias: ['JavaScript', 'Manifest V3', 'IndexedDB', 'APIs de tradução e câmbio'],
      link: 'https://chromewebstore.google.com/detail/hovertraduz-tradutor-inte/dappbocijfhabmngepdkdmfodfblledg',
    },
    {
      title: 'Hotel API',
      img: './assets/hotel_api_senior.png',
      tipo: 'Desafio técnico',
      ano: '2025',
      resumo: 'API REST de hóspedes e check-ins de hotel, entregue como desafio técnico para a Senior Sistemas.',
      destaques: [
        'Cálculo de diárias com regra para fim de semana, saída tardia e adicional de garagem.',
        'Documentada com Swagger e banco em Docker: sobe com um comando.',
      ],
      tecnologias: ['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'PostgreSQL', 'Docker', 'Swagger'],
      git: 'https://github.com/Jailsonr12/Desafio',
    },
    {
      title: 'API de Animes',
      img: './assets/anime_api_santander.png',
      tipo: 'Bootcamp',
      ano: '2023',
      resumo: 'API RESTful de animes, projeto final do Santander Bootcamp Fullstack Java + Angular.',
      destaques: [
        'CRUD completo com Spring Data JPA e contrato documentado com OpenAPI.',
        'Meu primeiro projeto em Spring Boot 3.',
      ],
      tecnologias: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'OpenAPI', 'Maven'],
      git: 'https://github.com/Jailsonr12/anime',
    },
    {
      title: 'efood',
      img: './assets/efood.png',
      tipo: 'Curso',
      ano: '2026',
      resumo: 'Delivery de restaurantes com carrinho e checkout. Projeto final do curso Fullstack da EBAC.',
      destaques: [
        'Estado do carrinho com Redux Toolkit e formulário de pagamento validado.',
        'Publicado na Vercel.',
      ],
      tecnologias: ['React', 'TypeScript', 'Redux Toolkit', 'Styled Components'],
      git: 'https://github.com/Jailsonr12/efood',
      link: 'https://efood-psi-lemon.vercel.app',
    },
    {
      title: 'Zelo BR',
      img: './assets/zelo_br.png',
      tipo: 'Curso',
      ano: '2022',
      resumo: 'Ouvidoria online para a prefeitura de Blumenau. Projeto final do +Devs2Blu 2022, feito em equipe.',
      destaques: [
        'Fiz praticamente todo o front em Angular, incluindo os modais, e organizei o trabalho do time.',
        'Layout no Figma, modelagem do banco e API em C#/.NET feitos em equipe. Apresentado em vídeo para a banca.',
      ],
      tecnologias: ['C#', '.NET', 'Angular', 'TypeScript', 'MySQL'],
      git: 'https://github.com/more-devs-2-blu/code-go?tab=readme-ov-file',
      link: 'https://www.youtube.com/watch?v=_BxGygkm3Lc&t=6s',
    },
    {
      title: 'No Limite Multas',
      img: './assets/no_limite_multas.png',
      tipo: 'Freelance',
      ano: '2024',
      resumo: 'Site institucional de uma empresa de recursos de multas, com chamada direta para o WhatsApp.',
      destaques: [
        'Página leve e responsiva, publicada na Vercel.',
      ],
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
      link: 'https://no-limite-multas-project.vercel.app',
    },
    {
      title: 'Site do Totoro',
      img: './assets/site_do_totoro.png',
      tipo: 'Estudo',
      ano: '2022',
      resumo: 'Consumo da API do Studio Ghibli com detalhes e trailers dos filmes.',
      destaques: [
        'Meu primeiro contato com fetch e JSON. A API foi desativada, o site segue como registro.',
      ],
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
      git: 'https://github.com/Jailsonr12/siteDoTotoro/tree/master',
      link: 'https://site-do-totoro.vercel.app/home.html',
    },
    {
      title: 'CSGO da Depressão',
      img: './assets/site_cs_go.png',
      tipo: 'Estudo',
      ano: '2024',
      resumo: 'Site colaborativo sobre CS:GO, desafio proposto em aula.',
      destaques: [
        'Trabalho em equipe com Git.',
      ],
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
      git: 'https://github.com/Jailsonr12/Site_CsGo/tree/master',
      link: 'https://site-cs-go.vercel.app/',
    },
    {
      title: 'Projeto Valorant',
      img: './assets/inicio_vava.png',
      tipo: 'Estudo',
      ano: '2024',
      resumo: 'Reprodução fiel de um layout criado no Figma.',
      destaques: [
        'Exercício de medir, alinhar e respeitar o design à risca.',
      ],
      tecnologias: ['HTML', 'CSS'],
      git: 'https://github.com/Jailsonr12/vava',
      link: 'https://www.figma.com/file/2YUQamnOmVTKvivDOFyuBr/vava?type=design&node-id=5-10&mode=design&t=4386WLy8BK5cmTjy-0',
    },
    {
      title: 'Primeiro Portfólio',
      img: './assets/jailsonr12.github.io_portfolio_.png',
      tipo: 'Estudo',
      ano: '2024',
      resumo: 'Primeira versão deste portfólio.',
      destaques: [
        'Onde comecei a aprender HTML e CSS de verdade.',
      ],
      tecnologias: ['HTML', 'CSS', 'JavaScript'],
      git: 'https://github.com/Jailsonr12/portfolio',
      link: 'https://portfolio-brown-seven-63.vercel.app/',
    },
  ];
}
