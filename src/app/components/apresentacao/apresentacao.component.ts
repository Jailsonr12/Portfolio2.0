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
        title: "Testes E2E com Cypress",
        img: "./assets/testes_cypress.png",
        sobre: "Testes ponta a ponta de uma agenda de contatos: inclusão, alteração e remoção.",
        tecnologia: "JavaScript, Cypress, Node.js",
        git: "https://github.com/Jailsonr12/testes_utilizando_cypress",
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
        title: "Lista de tarefas em Vue",
        img: "./assets/todo_vue.png",
        sobre: "Cadastro, conclusão e filtro de tarefas.",
        tecnologia: "Vue.js, JavaScript, Bootstrap",
        git: "https://github.com/Jailsonr12/todo-vue",
        link: "https://todo-vue-psi-azure.vercel.app"
      },
      {
        title: "Lista de Telefones",
        img: "./assets/lista_telefone.png",
        sobre: "Agenda de contatos com cadastro e remoção, manipulando o DOM com jQuery.",
        tecnologia: "HTML, CSS, JavaScript, jQuery",
        git: "https://github.com/Jailsonr12/lista_de_telefone",
        link: "https://lista-de-telefone-liard.vercel.app"
      },
      {
        title: "Calculadora de Médias",
        img: "./assets/calculadora_medias.png",
        sobre: "Cadastro de atividades e notas com cálculo automático da média e do resultado.",
        tecnologia: "HTML, CSS, JavaScript",
        git: "https://github.com/Jailsonr12/projeto_calculadora_medias",
        link: "https://projeto-calculadora-medias-gamma-six.vercel.app"
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
