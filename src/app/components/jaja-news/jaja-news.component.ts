import { Component } from '@angular/core';

interface Etapa { nome: string; texto: string; }
interface Alegacao { texto: string; tipo: string; estado: string; confianca: string; fontes: number; usada: boolean; }
interface Nota { criterio: string; nota: number; max: number; }

// Página de prova do Jajá News IA. Todos os dados abaixo saíram de um job real
// executado em 13/08/2026 (pauta: dívida pública). O repositório é privado.
@Component({
  selector: 'app-jaja-news',
  templateUrl: './jaja-news.component.html',
  styleUrls: ['./jaja-news.component.scss']
})
export class JajaNewsComponent {
  video = './assets/jaja-news/divida-publica.mp4';
  poster = './assets/jaja-news/divida-publica-poster.jpg';

  tecnologias = ['Java 25', 'Spring Boot', 'PostgreSQL', 'Docker', 'Ollama', 'JSON Schema', 'Piper', 'Whisper', 'SDXL', 'FFmpeg'];

  numeros = [
    { valor: '2', rotulo: 'fontes lidas' },
    { valor: '5', rotulo: 'alegações extraídas' },
    { valor: '1', rotulo: 'aprovada para o vídeo' },
    { valor: '100', rotulo: 'nota editorial, mínimo 85' },
    { valor: '42,8 s', rotulo: 'de vídeo em 4 cenas' },
    { valor: '0,005 s', rotulo: 'de diferença entre roteiro e vídeo' },
  ];

  etapas: Etapa[] = [
    { nome: 'Varredura', texto: 'Lê fontes por RSS, sitemap ou URL. Respeita robots.txt, evita duplicata e guarda autor e data.' },
    { nome: 'Investigação', texto: 'Quebra o artigo em alegações. Cada uma recebe tipo, estado e a citação literal da fonte.' },
    { nome: 'Roteiro', texto: 'A IA local escreve resumo e 4 cenas usando só as alegações aprovadas. A saída é validada por JSON Schema.' },
    { nome: 'Quality gate', texto: 'Uma segunda chamada avalia fidelidade, atribuição, contexto, clareza e segurança. Abaixo de 85 refaz, até 3 vezes.' },
    { nome: 'Mídia local', texto: 'Narração com Piper, legenda por palavra com Whisper, imagem por cena com SDXL. Tudo na minha GPU, sem serviço pago.' },
    { nome: 'Vídeo', texto: 'FFmpeg monta 1080×1920 com zoom, transição e legenda queimada. ffprobe confere a duração antes de aprovar.' },
  ];

  alegacoes: Alegacao[] = [
    { texto: 'A dívida bruta atingiu 81,9% do PIB em junho de 2026.', tipo: 'Fato', estado: 'Confirmada', confianca: '0,75', fontes: 2, usada: true },
    { texto: 'Relatório do IFI estima que pode chegar a 115% em 2036.', tipo: 'Previsão', estado: 'Não verificável', confianca: '0,00', fontes: 2, usada: false },
    { texto: 'A IFI projeta 95,7% do PIB no último ano do próximo governo e mais de 100% em 2032.', tipo: 'Previsão', estado: 'Não verificável', confianca: '0,00', fontes: 1, usada: false },
    { texto: 'A chance de ultrapassar 90% entre 2026 e 2030 é de 80%, segundo a IFI.', tipo: 'Previsão', estado: 'Não verificável', confianca: '0,00', fontes: 1, usada: false },
    { texto: 'O crescimento vai exigir medidas negociadas ainda este ano pelo próximo presidente.', tipo: 'Previsão', estado: 'Não verificável', confianca: '0,00', fontes: 1, usada: false },
  ];

  fontes = [
    { nome: 'Poder360 · Houldine Nascimento', data: '02/08/2026', url: 'https://www.poder360.com.br/poder-eleicoes-2026/lula-ignora-divida-diz-estar-inteiraco-e-mira-haddad-para-o-futuro/' },
    { nome: 'ICL Notícias · Felipe Rabioglio', data: '03/08/2026', url: 'https://iclnoticias.com.br/economia/divida-publica-em-alta-vai-exigir/' },
  ];

  notas: Nota[] = [
    { criterio: 'Fidelidade às evidências', nota: 40, max: 40 },
    { criterio: 'Atribuição e controvérsias', nota: 20, max: 20 },
    { criterio: 'Contexto e completude', nota: 15, max: 15 },
    { criterio: 'Clareza', nota: 15, max: 15 },
    { criterio: 'Segurança editorial', nota: 10, max: 10 },
  ];

  auditoria: string[][] = [
    ['Finalidade', 'Geração do roteiro'],
    ['Modelo', 'qwen3.5:9b, rodando local no Ollama'],
    ['Parâmetros', 'temperature 0,2 · contexto 8.192 tokens'],
    ['Versão', 'prompt p003b-generation-v8 · schema v2'],
    ['Entrada', 'tópico, data, alegações permitidas, limite de palavras e checklist obrigatório'],
    ['Saída', 'JSON validado: resumo e 4 cenas, cada cena citando o id da alegação que usa'],
    ['Resultado', '1ª tentativa, sucesso, 59 segundos'],
  ];

  mostra = [
    'Separar fato de previsão antes de deixar a IA escrever. Só o que foi confirmado vira narração.',
    'Validar a saída do modelo por schema e por uma segunda avaliação, em vez de confiar no texto.',
    'Registrar prompt, modelo, parâmetros, entrada e saída de cada chamada. Dá para auditar depois.',
    'Pipeline que salva o estado de cada etapa e retoma de onde parou quando algo falha.',
  ];
}
