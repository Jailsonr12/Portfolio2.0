import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss','./hello.component.responsive.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HelloComponent implements OnInit {
  @Input() title?: string;
  @Input() iam?: string;
  @Input() subtitleOne?: String;
  @Input() subtitleTwo?: String;
  @Input() git?: String;
  @Input() linkedin?: String;
  @Input() curriculum?: String;
  @Input() email?: String;

  nameTitles: Array<string> = [
    'Jailson',
    'Jailson Roth',
    'Jaja',
    'Jailson da Silva Roth',
  ];

  aboutMe: Array<string> = [
    'Desenvolvedor de integrações na Senior Sistemas e líder de squad',
    'Referência técnica em Ronda X, protocolos de comunicação e drivers de fabricante',
    'Java, Spring Boot, APIs REST, WebSocket, SQL, Docker e CI/CD',
    'Acho a causa raiz em problemas que cruzam banco, SDK e dispositivo',
    'Crio simuladores e ferramentas de teste para o time',
    'Formado em Engenharia de Software pela Estácio, em Blumenau, SC',
    'Gosto de anime, mangá, videogame, leitura e academia',
    'Muito prazer, este é meu portfólio e um pouco sobre mim'
  ];

  ngOnInit(): void {
    this.title = this.title || 'Jailson';
    this.iam = this.iam || 'Muito prazer, este é meu portfólio e um pouco sobre mim';
    this.subtitleOne = 'DESENVOLVEDOR'
    this.subtitleTwo = 'BACKEND'
    this.git= 'https://github.com/Jailsonr12'
    this.linkedin = 'https://www.linkedin.com/in/jailsonroth/'
    this.curriculum = 'assets/curriculo-jailson-roth.pdf'
    this.email = 'mailto:jailson.rothdev@gmail.com'
    this.changeName();
    this.changeiam();
  }

  changeName() {
    let i = 0;
    setInterval(() => {
      this.title = this.nameTitles[i];
      i = (i === this.nameTitles.length - 1) ? 0 : i + 1;
    }, 3000);
  }

  changeiam() {
    let i = 0;
    setInterval(() => {
      this.iam = this.aboutMe[i];
      i = (i === this.aboutMe.length - 1) ? 0 : i + 1;
    }, 4500);
  }
}
