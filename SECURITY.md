# SECURITY.md

## Escopo
Documento tecnico de seguranca/privacidade do projeto `protifolio` (MVP atual + plano de producao).

## Dados armazenados no MVP (Front-first)
No MVP, os dados do portfolio ficam no navegador (`localStorage`) por username.
Exemplos:
- nome, bio, links, projetos, skills, experiencia.
- tema (cores/modo).
- links de curriculo/pagamento.

Limite do MVP:
- `localStorage` nao e adequado para dados sensiveis e nao oferece protecao forte contra uso indevido no cliente.

## Dados no backend (quando habilitado)
- sessao de autenticacao (cookie HttpOnly).
- identificacao basica do usuario GitHub (username, displayName, avatarUrl).
- conteudo do portfolio salvo por username.

## Controles Minimos de Seguranca
- validacao de ownership no backend para qualquer `PUT /api/portfolio/:username`.
- rate limiting em rotas de autenticacao e escrita.
- limite de payload (`express.json` com limite).
- validacao de estrutura e tamanho de portfolio.
- sanitizacao de username para evitar path traversal.

## Upload de Imagens (futuro)
Recomendado para producao:
- object storage (Firebase Storage/S3).
- limite de tamanho por arquivo.
- validacao de MIME type.
- URL assinada/pasta por usuario.
- CDN para distribuicao e cache.

## Anti-abuso / Anti-enchimento de conteudo
- limitar numero de projetos/itens por portfolio.
- limitar frequencia de escrita por IP e por usuario.
- bloquear tentativas excessivas (429).
- monitorar anomalias e criar alertas.

## LGPD (guia tecnico, sem parecer juridico)
Principios aplicados:
- minimizacao: coletar apenas dados necessarios ao portfolio.
- finalidade: uso exclusivo para autenticacao e exibicao do perfil.
- transparencia: informar claramente o que e salvo e onde.
- remocao: oferecer forma de apagar portfolio e dados associados.
- consentimento: usuario escolhe publicar dados e links.

## Publicacao e pagamento (futuro)
Campos previstos no schema:
- `isPublic`
- `paidPublication`
- `publishedAt`

Regra planejada:
- somente perfis com publicacao paga ficam publicos para visitantes.
- sem pagamento, apenas dono autenticado acessa.

## Checklist para subir em producao
- configurar OAuth real com credenciais validas.
- usar HTTPS e cookie `secure=true`.
- habilitar CORS apenas para domínios permitidos.
- proteger backend com rate limit e logs.
- separar segredos em variaveis de ambiente.
- criar backup e politica de retencao de dados.
