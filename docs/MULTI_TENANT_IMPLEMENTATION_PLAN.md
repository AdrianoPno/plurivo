# Plano de implementacao multi-tenant

## Objetivo

Transformar a plataforma em um produto SaaS no qual cada organizacao possui identidade visual, usuarios, modulos e dados isolados, mantendo o `platform-shell` como ponto central de autenticacao e administracao.

## Principios

- O backend determina o `tenantId` a partir do usuario autenticado.
- Nenhuma API confia em `tenantId` enviado livremente pelo frontend.
- `unidadeId` representa uma unidade operacional dentro de uma organizacao.
- `SUPER` administra a plataforma; os demais papeis pertencem a um tenant.
- IDs de modulos continuam centralizados em `shared/constants/modules`.
- A migracao ocorre por modulo para preservar o ambiente atual.

## Fase 1 - Nucleo de organizacoes

- [x] Criar contrato compartilhado de tenant.
- [x] Criar repositorio Firestore para `tenants`.
- [x] Criar casos de uso de cadastro, consulta e edicao.
- [x] Expor rotas administrativas apenas para `SUPER`.
- [x] Incluir `tenantId` no perfil autenticado e no contrato de usuario.
- [x] Criar tela de administracao de organizacoes.
- [x] Associar administradores e usuarios a uma organizacao.

## Fase 2 - Autorizacao e migracao

- [ ] Criar tenant inicial para a instalacao existente.
- [ ] Migrar usuarios existentes para esse tenant.
- [x] Exigir tenant para todo usuario que nao seja `SUPER`.
- [x] Impedir alteracao de tenant por administradores comuns.
- [x] Validar status do tenant durante a autenticacao.
- [ ] Validar se o modulo solicitado esta ativo para o tenant.

## Fase 3 - Isolamento em Pessoas e Unidades (`coop-manager`)

- [ ] Adicionar `tenantId` a unidades, cooperados e cargos.
- [ ] Filtrar todas as consultas pelo tenant autenticado.
- [ ] Validar relacionamentos dentro do mesmo tenant.
- [ ] Criar indices compostos necessarios no Firestore.
- [ ] Testar tentativa de acesso cruzado entre organizacoes.

## Fase 4 - Isolamento em Pesquisas e Insights (`vox-observatory`)

- [ ] Adicionar `tenantId` a pesquisas e perfis locais.
- [ ] Filtrar todas as consultas pelo tenant autenticado.
- [ ] Validar propriedade antes de consultar, editar ou excluir.
- [ ] Criar indices compostos necessarios no Firestore.
- [ ] Testar tentativa de acesso cruzado entre organizacoes.

## Fase 5 - White-label

- [x] Carregar nome e tema do tenant autenticado.
- [ ] Remover marca fixa dos modulos e metadados publicos.
- [x] Exibir somente os modulos contratados.
- [x] Definir fallback visual seguro para tenants sem personalizacao.
- [ ] Preparar dominio personalizado como recurso opcional futuro.

## Fase 6 - Operacao comercial

- [ ] Implementar trilha de auditoria.
- [ ] Definir backup, restauracao e retencao.
- [ ] Adicionar monitoramento e alertas de erros.
- [ ] Criar importacao e exportacao de dados.
- [ ] Documentar onboarding, suporte e encerramento de conta.
- [ ] Revisar LGPD, termos de uso e politica de privacidade.

## Criterio para o primeiro piloto pago

O piloto pode comecar quando as fases 1 a 4 estiverem concluidas, houver backup testado e os fluxos principais possuirem testes de autorizacao. White-label completo pode evoluir durante o piloto, desde que o isolamento de dados ja esteja garantido.
