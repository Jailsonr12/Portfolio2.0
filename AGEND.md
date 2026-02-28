# AGEND.md

## Objetivo
Manter o HTML atual como base visual oficial e evoluir para um front 100% editavel (dados e estilos), sem quebrar a estrutura original.

Rotas-alvo:
- `/protifolio/home`: login/home.
- `/protifolio/:username`: portfolio publico.

## Fonte de Verdade do HTML Atual (JSON)
```json
{
  "version": "1.0.0",
  "baseRule": "manter estrutura atual e editar apenas conteudo/configuracao",
  "routes": {
    "/protifolio/home": {
      "template": "src/app/page/home/home.component.html",
      "root": [
        {
          "component": "app-hello",
          "template": "src/app/components/hello/hello.component.html",
          "structure": {
            "header": {
              "blocks": [
                "name (OI + svg mao + nome animado)",
                "subtitulos (subtitleOne, subtitleTwo)",
                "links icones (git, linkedin, curriculum)",
                "texto rotativo iam"
              ]
            }
          }
        },
        {
          "component": "app-apresentacao",
          "template": "src/app/components/apresentacao/apresentacao.component.html",
          "structure": {
            "header": "titulo Projetos",
            "main": {
              "list": "*ngFor projetos",
              "item": "app-projeto-direita"
            }
          }
        }
      ]
    },
    "/protifolio/:username": {
      "templateTarget": "nova pagina de portfolio mantendo padrao visual atual",
      "navbar": {
        "owner": ["Editar", "Salvar", "Sair", "Vincular"],
        "visitor": ["menu publico", "CTA: Crie seu perfil"]
      }
    }
  },
  "components": {
    "app-projeto-direita": {
      "template": "src/app/components/projeto-direita/projeto-direita.component.html",
      "structure": [
        "card-title",
        "image",
        "about",
        "technologies",
        "links github/page",
        "modal imagem"
      ]
    }
  }
}
```

## O que pode ser editado (sem mudar estrutura)
- Texto: nome, bio, titulos, subtitulos, descricao de projeto.
- Links: github, linkedin, site, curriculo, pagina do projeto.
- Midia: avatar, banner, imagem de card.
- Listas: projetos, skills, experiencias.
- Tema: cores e dark/light mode.

## O que nao pode ser alterado
- Hierarquia base dos componentes (`app-hello`, `app-apresentacao`, `app-projeto-direita`).
- Estrutura macro de secoes (header/introducao + lista de projetos).

## Modelo editavel (JSON de conteudo)
```json
{
  "schemaVersion": 1,
  "username": "jailsonr12",
  "profile": {
    "title": "Jailson",
    "iam": "Muito prazer...",
    "subtitleOne": "DESENVOLVEDOR",
    "subtitleTwo": "FULL-STACK",
    "links": {
      "github": "",
      "linkedin": "",
      "curriculum": "",
      "website": "",
      "paymentUrl": ""
    }
  },
  "projects": [
    {
      "id": "p-1",
      "title": "Projeto",
      "img": "",
      "sobre": "",
      "tecnologia": "",
      "git": "",
      "link": ""
    }
  ],
  "theme": {
    "mode": "dark",
    "colors": {
      "primary": "#4ea5ff",
      "background": "#0d1117",
      "text": "#c9d1d9"
    }
  },
  "publication": {
    "isPublic": true,
    "paidPublication": false,
    "publishedAt": null
  },
  "updatedAt": "2026-02-28T00:00:00.000Z"
}
```

## Regra de Owner Mode
- Dono: `authUser.username === :username`.
- Dono logado ve icones de edicao na navbar e pode salvar.
- Visitante ve apenas conteudo publico + CTA para criar perfil.

## Persistencia
- MVP: `localStorage` por username.
- Evolucao: `PortfolioRepository` -> `ApiPortfolioRepository`.

## Proximas iteracoes (sem quebrar front)
1. Criar pagina `/protifolio/:username` com navbar por papel.
2. Conectar editor aos campos atuais do HTML (app-hello + projetos).
3. Adicionar modal de customizacao e salvar no repositorio.
4. Integrar OAuth GitHub estavel e fallback dev local.
