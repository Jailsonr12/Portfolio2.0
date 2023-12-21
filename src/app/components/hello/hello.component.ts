import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss','./hello.component.responsive.scss'],
})
export class HelloComponent implements OnInit {
  @Input()
  title?: string = 'Jailson';

  @Input()
  Iam?: string = 'Muito prazer esse é meu portfólio, e um pouco sobre mim';

  nameTitles: Array<string> = [
    'Jaja',
    'Jailson da silva roth',
    'Jailson Roth',
    'Roth Jailson',
    'Jailson',
  ];

  aboutMe: Array<string> = [
    'Tenho 23 anos e estou cursando Engenharia de Software',
    'Gosto de anime, manga, videogame, ler, ir para academia',
    'Tenho experiência de 1 ano como Desenvolvimento Web full-stack.',
    'Conhecimento nas linguagens: Java, TypeScript, Angular, JS e MySQL',
    'Sempre estou em busca de meu conhecimentos',
    'Muito prazer esse é meu portfólio, e um pouco sobre mim'
  ];

  ngOnInit(): void {
    this.changeName();
    this.changeIam();
  }
  changeName() {
    let i = 0;
    setInterval(() => {
      this.title = this.nameTitles[i];
      i = i === +this.nameTitles.length - 1 ? 0 : i + 1;
    }, 3000);
  }
  changeIam() {
    let i = 0;
    setInterval(() => {
      this.Iam = this.aboutMe[i];
      i = i === +this.aboutMe.length - 1 ? 0 : i + 1;
    }, 6000);
  }
}
