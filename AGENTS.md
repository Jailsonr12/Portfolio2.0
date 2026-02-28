# AGENTS.md

## Objetivo do projeto
- Este repositório mantém um portfolio Angular com edição dinâmica por usuário.
- A rota pública principal é `/protifolio/:username`.
- A rota de edição é `/protifolio/:username/editor`.

## Regras de trabalho
- Preservar o padrão visual existente (gradientes escuros, botões arredondados, cards).
- Preferir edição orientada a dados do `PortfolioDocument` em `src/app/models/portfolio-data.model.ts`.
- Novos campos de conteúdo devem manter compatibilidade com o `PortfolioDataService`.
- Evitar mudanças destrutivas na ordem de blocos sem ação explícita do usuário.

## Editor (diretrizes)
- O editor deve permitir:
  - reordenação visual dos blocos;
  - ativar/desativar blocos;
  - edição inline por bloco;
  - edição completa por aba.
- Sempre manter um caminho de fallback: se um bloco não estiver na ordem, ele deve poder ser reinserido.

## Qualidade
- Rodar `npm.cmd run build` após mudanças relevantes.
- Se a build falhar por budget de estilo, reportar claramente quais arquivos excederam.
- Não remover funcionalidades existentes para introduzir novas.

## Convenções
- Linguagem da interface: Português.
- Código: TypeScript/HTML/SCSS com nomes descritivos.
- Evitar dependências novas sem necessidade real.
