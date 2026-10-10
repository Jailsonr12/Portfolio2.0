import { Component } from '@angular/core';

interface Cargo {
  empresa: string;
  cargo: string;
  periodo: string;
  itens: string[];
}

interface Grupo {
  nome: string;
  itens: string[];
}

interface Exemplo {
  titulo: string;
  mostra: string;
  texto: string;
}

interface Curso {
  nome: string;
  status: 'concluído' | 'em andamento';
}

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.scss']
})
export class ExperienciaComponent {

  sobre = 'Desenvolvedor de software com foco em backend Java e integrações entre sistemas. Na Senior Sistemas lidero a squad de integrações de controle de acesso e sou referência técnica em protocolos de comunicação e drivers de fabricante. Vim da área de qualidade, o que me deixou o hábito de medir antes de opinar e de ir até a camada onde o problema nasce.';

  competencias: Grupo[] = [
    { nome: 'Backend', itens: ['Java 8 a 25', 'Spring Boot 3', 'Spring Modulith', 'JPA / Hibernate', 'APIs REST', 'WebSocket', 'RabbitMQ', 'PostgreSQL', 'MySQL', 'Flyway', 'Maven', 'Swagger'] },
    { nome: 'Qualidade e DevOps', itens: ['Git / Git Flow', 'GitHub Actions', 'Azure DevOps', 'SonarQube', 'Docker', 'Selenium', 'Postman', 'Testes de carga'] },
    { nome: 'Frontend', itens: ['Angular', 'TypeScript', 'React', 'JavaScript', 'HTML', 'CSS', 'Bootstrap'] },
  ];

  exemplos: Exemplo[] = [
    {
      titulo: 'Simulador de dispositivos',
      mostra: 'Iniciativa',
      texto: 'Homologar um driver dependia de equipamento físico e do conhecimento de uma pessoa só. Sem ninguém pedir, construí um simulador que responde como a SDK real. Na primeira homologação ele achou 4 defeitos no driver do fabricante.',
    },
    {
      titulo: 'Teste de carga',
      mostra: 'Definir a métrica antes de medir',
      texto: 'Ninguém sabia quantos dispositivos o produto aguentava. Defini o que medir, desenhei a subida em degraus e simulei 1.000 dispositivos. Achei um bug no próprio simulador no meio do teste e refiz os degraus antes de publicar. O limite virou documentação oficial.',
    },
    {
      titulo: 'Base de conhecimento do time',
      mostra: 'Tirar o time da dependência de uma pessoa',
      texto: 'Montei uma base compartilhada que o time consulta por assistente de IA, sem código-fonte na máquina por segurança, e integrei skills de documentação e revisão ao fluxo de desenvolvimento.',
    },
    {
      titulo: 'Jajá News IA',
      mostra: 'Aprender fazendo',
      texto: 'Projeto pessoal em Java 25 e Spring Boot, monólito modular com Spring Modulith, PostgreSQL, Flyway e Ollama em Docker. Pesquisa notícias com IA, registra evidências com fonte e gera vídeos curtos. É onde testo arquitetura antes de levar para o trabalho.',
    },
    {
      titulo: 'HoverTraduz',
      mostra: 'Resolver um problema meu e entregar como produto',
      texto: 'Extensão Chrome que traduz texto ao passar o mouse e converte moedas sem alterar a página, com cache local e política de privacidade publicada aqui no site.',
    },
    {
      titulo: 'Da mecânica para o software',
      mostra: 'Trajetória',
      texto: 'Sou técnico em Mecânica Industrial e trabalhei como montador e inspetor de qualidade antes de programar. Em 2022 entrei no +Devs2Blu, comecei como estagiário Java e, em 2026, virei squad leader. A inspeção me ensinou a procurar o defeito antes que ele chegue no cliente.',
    },
  ];

  cargos: Cargo[] = [
    {
      empresa: 'Senior Sistemas',
      cargo: 'Software Developer I · Squad Leader',
      periodo: 'fev/2026 – atual · Blumenau, SC',
      itens: [
        'Sistemas corporativos em Java 8, 17 e 25: legado, aplicações modernas e novas funcionalidades.',
        'Spring Boot, APIs REST, JPA, Flyway, SQL, SonarQube e pipelines CI/CD.',
        'Integrações com dispositivos de controle de acesso via SDK e WebSocket.',
        'Incidentes em ambiente de cliente, suporte técnico a fabricantes e liderança da squad.',
        'Simulador de dispositivos e teste de carga que viraram ferramenta e documentação oficial do produto.',
      ]
    },
    {
      empresa: 'Senior Sistemas',
      cargo: 'Software Quality Analyst I',
      periodo: 'set/2024 – fev/2026 · Blumenau, SC',
      itens: [
        'Homologação e validação de dispositivos: comandos, status e eventos críticos.',
        'Validação das notificações entre o driver do fabricante e o sistema via WebSocket.',
      ]
    },
    {
      empresa: 'CloudPark',
      cargo: 'Analista de teste / QA',
      periodo: 'jan/2024 – set/2024 · Blumenau, SC',
      itens: [
        'Automação de testes com Selenium e Python; liberação semanal de builds.',
        'Script em Python para monitorar dispositivos: validação caiu de 1 hora para 5 minutos.',
      ]
    },
    {
      empresa: 'Berkan IT Solution',
      cargo: 'Desenvolvedor Java Full Stack (estágio)',
      periodo: 'ago/2022 – ago/2023 · Blumenau, SC',
      itens: [
        'Sistema de Gestão de Terceiros (GD3): Java, Spring Boot, MySQL, Angular e TypeScript.',
        'Relatórios personalizados, paginação dinâmica e correção de falhas críticas.',
      ]
    },
    {
      empresa: 'Hennings Mangueiras',
      cargo: 'Montador · Inspetor · Assistente Técnico',
      periodo: 'ago/2020 – jun/2022 · Blumenau, SC',
      itens: [
        'Montagem de mangueiras hidráulicas, inspeção de peças no recebimento e assistência técnica. Antes da tecnologia.',
      ]
    },
  ];

  formacao: string[] = [
    'Bacharel em Engenharia de Software · Estácio (2022 – 2026) · CR 8,77',
    'Técnico em Mecânica Industrial · CEDUP Hermann Hering (2016 – 2018)',
  ];

  cursos: Curso[] = [
    { nome: 'EBAC · Profissão: Desenvolvedor Full Stack Java', status: 'concluído' },
    { nome: '+Devs2Blu 2022 · Desenvolvedor C# FullStack (Proway, BluSoft e Prefeitura de Blumenau)', status: 'concluído' },
    { nome: 'Santander Bootcamp 2023 · Fullstack Java + Angular (DIO)', status: 'concluído' },
    { nome: 'Direitos e Privacidade dos Usuários', status: 'concluído' },
    { nome: 'curso.dev · Programação e engenharia de software', status: 'em andamento' },
    { nome: 'Java (Nelio Alves) · JavaScript (DankiCode) · Algoritmos (Geek University) · AWS Discovery Day (Ka Solution)', status: 'concluído' },
  ];
}
