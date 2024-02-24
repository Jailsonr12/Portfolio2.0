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
  @Input() Iam?: string;

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
    this.Iam = this.Iam || 'Muito prazer, este é meu portfólio e um pouco sobre mim';
    this.changeName();
    this.changeIam();
  }

  changeName() {
    let i = 0;
    setInterval(() => {
      this.title = this.nameTitles[i];
      i = (i === this.nameTitles.length - 1) ? 0 : i + 1;
    }, 3000);
  }

  changeIam() {
    let i = 0;
    setInterval(() => {
      this.Iam = this.aboutMe[i];
      i = (i === this.aboutMe.length - 1) ? 0 : i + 1;
    }, 4000);
  }
}
