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

  nameTitles: Array<string> = [
    'Jaja',
    'Jailson da silva roth',
    'Jailson Roth',
    'Roth Jailson',
    'Jailson',
  ];
  
  aboutMe: Array<string> = [
    'Tenho 23 anos e estou cursando Engenharia de Software',
    'Gosto de anime, manga, videogame, ler e ir para academia',
    'Tenho experiência de 1 ano como Desenvolvimento Web full-stack.',
    'Atualmente trabalho como QA e DevOps na CloudPark',
    'Conhecimento nas linguagens: Java, TypeScript, Angular, JS e MySQL',
    'Sempre estou em busca de mais conhecimento e aprimoramento',
    'Muito prazer esse é meu portfólio, e um pouco sobre mim'
  ];

  ngOnInit(): void {
    this.title = this.title || 'Jailson';
    this.iam = this.iam || 'Muito prazer, este é meu portfólio e um pouco sobre mim';
    this.subtitleOne = 'DESENVOLVEDOR'
    this.subtitleTwo = 'FULL-STACK'
    this.git= 'https://github.com/Jailsonr12'
    this.linkedin = 'https://www.linkedin.com/in/jailsonroth/'
    this.curriculum = 'https://drive.google.com/file/d/1Tk5cJhaPI956wzaAYvSSaP9MH67Ax0dF/view?usp=drive_link'
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
    }, 4000);
  }
}
