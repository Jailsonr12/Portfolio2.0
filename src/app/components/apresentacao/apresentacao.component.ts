import { Component, Input, OnInit } from '@angular/core';

// Interface para definir a estrutura de um projeto
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

  @Input() title: string | undefined;
  projetos: Projeto[] = []; // Inicialize projetos como um array vazio ou com os projetos relevantes

  constructor() {
    this.title = "arroz";
    this.projetos = [
      {
        title: "Primeiro Portfólio",
        img: "./assets/jailsonr12.github.io_portfolio_.png",
        sobre: "Primeira versão do portfólio.",
        tecnologia: "HTML, CSS, JavaScript",
        git: "https://github.com/usuario/projeto1",
        link: "https://portfolio-brown-seven-63.vercel.app/"
      },
      {
        title: "Projeto final +Devs2Blu 2022",
        img: "./assets/zelo_br.png",
        sobre: "Sistema para inovar as ouvidorias.",
        tecnologia: "C#, TypeScript, Angular, HTML, CSS, MySQL",
        git: "https://github.com/more-devs-2-blu/code-go?tab=readme-ov-file",
        link: "https://www.youtube.com/watch?v=_BxGygkm3Lc&t=6s"
      },
      {
        title: "Projeto Valorant",
        img: "./assets/inicio_vava.png",
        sobre: "Treinando habilidades para reproduzir o design criado",
        tecnologia: "HTML, CSS",
        git: "https://github.com/Jailsonr12/vava",
        link: "https://www.figma.com/file/2YUQamnOmVTKvivDOFyuBr/vava?type=design&node-id=5-10&mode=design&t=4386WLy8BK5cmTjy-0"
      },
      {
        title: "Site Do Totoro",
        img: "./assets/site_do_totoro.png",
        sobre: "Consumindo API sobre o Studio Ghibli, onde constam detalhes e trailers do filme (API está desativada atualmente).",
        tecnologia: "HTML, CSS, JS",
        git: "https://github.com/Jailsonr12/siteDoTotoro/tree/master",
        link: "https://site-do-totoro.vercel.app/home.html"
      },
      {
        title: "CSGO da Depressão",
        img: "./assets/site_cs_go.png",
        sobre: "Site colaborativo, sobre o tema CSGO",
        tecnologia: "HTML, CSS, JS",
        git: "https://github.com/Jailsonr12/Site_CsGo/tree/master",
        link: "https://site-cs-go.vercel.app/"
      },

    ];
  }

  ngOnInit(): void {
  }
}
