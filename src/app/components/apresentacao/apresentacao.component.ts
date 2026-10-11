import { Component, OnInit } from '@angular/core';

// Estrutura de um projeto exibido na lista
interface Projeto {
  title: string;
  img: string;
  sobre: string;
  tecnologia: string;
  git: string | undefined;
  link: string | undefined;
}

@Component({
  selector: 'app-apresentacao',
  templateUrl: './apresentacao.component.html',
  styleUrls: ['./apresentacao.component.scss']
})
export class ApresentacaoComponent implements OnInit {

  projetos: Projeto[] = [];

  constructor() {
    this.projetos = [
      {
        title: "Jajá News IA",
        img: "./assets/jaja_news_ia.png",
        sobre: "Pesquisa notícias com IA local, registra alegações com fonte e gera vídeos curtos verticais com narração, legendas e imagens. Pipeline com retomada, auditoria de cada chamada e quality gates.",
        tecnologia: "Java 25, Spring Boot, PostgreSQL, Docker, Ollama, Whisper, FFmpeg",
        git: undefined,
        link: undefined
      },
      {
        title: "Jajá Estuda",
        img: "./assets/jaja_estuda.png",
        sobre: "Escola particular com IA para quem tem dislexia ou TDAH: lê o edital, monta o plano, escreve o material com fonte e gera simulados. Backend Java, frontend TypeScript, tudo em Docker Compose.",
        tecnologia: "Java 25, Spring Boot, PostgreSQL, TypeScript, Docker Compose, Ollama, nginx",
        git: undefined,
        link: undefined
      },
      {
        title: "HoverTraduz",
        img: "./assets/hovertraduz.png",
        sobre: "Extensão Chrome que traduz texto ao passar o mouse e converte preços em outras moedas, sem alterar a página. Cache em IndexedDB para evitar chamadas repetidas.",
        tecnologia: "JavaScript, Chrome Extension (Manifest V3), IndexedDB, APIs de tradução e câmbio",
        git: undefined,
        link: undefined
      },
      {
        title: "Hotel API — Desafio Técnico Senior",
        img: "./assets/hotel_api_senior.png",
        sobre: "API REST de hóspedes e check-ins de hotel, com cálculo de diárias e garagem. Documentada com Swagger.",
        tecnologia: "Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL, Docker",
        git: "https://github.com/Jailsonr12/Desafio",
        link: undefined
      },
      {
        title: "API de Animes — Santander Dev Week 2023",
        img: "./assets/anime_api_santander.png",
        sobre: "API RESTful de animes, desafio final do bootcamp Santander Fullstack Java + Angular.",
        tecnologia: "Java 17, Spring Boot 3, Spring Data JPA, OpenAPI (Swagger), Maven",
        git: "https://github.com/Jailsonr12/anime",
        link: undefined
      },
      {
        title: "efood — Projeto final EBAC",
        img: "./assets/efood.png",
        sobre: "Delivery de restaurantes com carrinho e checkout. Projeto final do curso Fullstack da EBAC.",
        tecnologia: "React, TypeScript, Redux Toolkit, Styled Components",
        git: "https://github.com/Jailsonr12/efood",
        link: "https://efood-psi-lemon.vercel.app"
      },
      {
        title: "Zelo BR — Projeto final +Devs2Blu 2022",
        img: "./assets/zelo_br.png",
        sobre: "Ouvidoria online para a prefeitura: layout no Figma, modelagem do banco, API em C#/.NET e front em Angular.",
        tecnologia: "C#, TypeScript, Angular, HTML, CSS, MySQL",
        git: "https://github.com/more-devs-2-blu/code-go?tab=readme-ov-file",
        link: "https://www.youtube.com/watch?v=_BxGygkm3Lc&t=6s"
      },
      {
        title: "No Limite Multas",
        img: "./assets/no_limite_multas.png",
        sobre: "Site institucional de uma empresa de recursos de multas, com chamada direta para o WhatsApp.",
        tecnologia: "HTML, CSS, JavaScript",
        git: undefined,
        link: "https://no-limite-multas-project.vercel.app"
      },
      {
        title: "Site do Totoro",
        img: "./assets/site_do_totoro.png",
        sobre: "Consumo da API do Studio Ghibli, com detalhes e trailers dos filmes (API desativada).",
        tecnologia: "HTML, CSS, JavaScript",
        git: "https://github.com/Jailsonr12/siteDoTotoro/tree/master",
        link: "https://site-do-totoro.vercel.app/home.html"
      },
      {
        title: "CSGO da Depressão",
        img: "./assets/site_cs_go.png",
        sobre: "Site colaborativo sobre o tema CSGO.",
        tecnologia: "HTML, CSS, JavaScript",
        git: "https://github.com/Jailsonr12/Site_CsGo/tree/master",
        link: "https://site-cs-go.vercel.app/"
      },
      {
        title: "Projeto Valorant",
        img: "./assets/inicio_vava.png",
        sobre: "Reprodução fiel de um design criado no Figma.",
        tecnologia: "HTML, CSS",
        git: "https://github.com/Jailsonr12/vava",
        link: "https://www.figma.com/file/2YUQamnOmVTKvivDOFyuBr/vava?type=design&node-id=5-10&mode=design&t=4386WLy8BK5cmTjy-0"
      },
      {
        title: "Primeiro Portfólio",
        img: "./assets/jailsonr12.github.io_portfolio_.png",
        sobre: "Primeira versão do portfólio.",
        tecnologia: "HTML, CSS, JavaScript",
        git: "https://github.com/Jailsonr12/portfolio",
        link: "https://portfolio-brown-seven-63.vercel.app/"
      }
    ];
  }

  ngOnInit(): void {
  }
}
