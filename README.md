# Portfólio — Jailson Roth

Portfólio pessoal em Angular. No ar em https://www.jrweb.com.br (Vercel).

## Rodar localmente

Requisitos: Node 18 ou superior.

```bash
npm ci
npm start        # http://localhost:4200
npm run build    # gera a pasta dist/
```

## Onde editar o conteúdo

| O que mudar | Arquivo |
|---|---|
| Nome, frases "sobre mim", links (GitHub, LinkedIn, currículo, e-mail) | `src/app/components/hello/hello.component.ts` |
| Seções "Sobre mim" e "Experiência" (resumo, competências, cargos, formação, cursos) | `src/app/components/experiencia/experiencia.component.ts` |
| Currículo em PDF (link da capa, do menu e do rodapé) | `src/assets/curriculo-jailson-roth.pdf` |
| Menu fixo e rodapé | `src/app/components/nav/` e `src/app/components/footer/` |
| Lista de projetos (título, imagem, descrição, tecnologias, links) | `src/app/components/apresentacao/apresentacao.component.ts` |
| Imagens dos projetos | `src/assets/` |
| Título e descrição da página (SEO) | `src/index.html` |
| Política de privacidade do HoverTraduz | `src/app/components/politica/` |

## Deploy

Todo push na branch `master` dispara o deploy na Vercel. O workflow em
`.github/workflows/ci.yml` só confere se o build passa.
