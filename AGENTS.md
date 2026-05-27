# ✅ Checklist de Revisão para IA e Assistentes de Código

Ao revisar, corrigir ou criar código neste projeto, a IA deve verificar obrigatoriamente os pontos abaixo.

---

## Arquitetura

- A funcionalidade respeita Clean Architecture?
- Use Case está livre de framework e persistência concreta?
- Controller está apenas orquestrando?
- Rotas fazem composição de dependência?
- Schemas Zod estão na rota?
- Código compartilhado entre módulos deve ficar em `shared/`.
- Evitar duplicação de lógica entre módulos.
- Não criar abstrações genéricas desnecessárias.
- Não misturar regra de negócio com controller, rota ou camada de banco.
- Repositórios devem esconder detalhes de persistência.
- Use Cases devem receber dependências por interface/contrato quando aplicável.
- Controllers não devem acessar banco diretamente.
- Rotas não devem conter regra de negócio.

---

## Autenticação e SSO

Este projeto usa autenticação centralizada via `platform-shell`.

A IA deve respeitar obrigatoriamente as regras abaixo:

- Não criar `AuthContext` individual por módulo.
- Não criar `useAuth` individual por módulo.
- Não criar `AuthProvider` individual por módulo.
- Não criar `PrivateRoute` individual por módulo.
- A fonte oficial de autenticação deve ser `shared/auth`.
- O login é responsabilidade do `platform-shell`.
- Os módulos devem consumir o token central `platform-token`.
- Os módulos devem validar o token no backend.
- As APIs não devem confiar apenas no frontend.
- A página `/login` nunca deve ser protegida por `PrivateRoute`.
- Telas privadas devem usar `PrivateRoute` vindo de `shared/auth`.
- O hook oficial deve ser `useAuth` vindo de `shared/auth`.
- O provider oficial deve ser `AuthProvider` vindo de `shared/auth`.
- Imports antigos de autenticação devem ser migrados para `shared/auth`.
- Usuário sem token deve ser redirecionado para o login central.
- Usuário com token inválido deve ser deslogado.
- Usuário inativo não deve acessar rotas privadas.
- O frontend pode esconder elementos, mas a autorização real deve acontecer no backend.

### Estrutura oficial de autenticação

A IA deve priorizar esta estrutura:

```txt
shared/auth/
  auth-context.tsx
  auth-provider.tsx
  private-route.tsx
  index.ts
Imports corretos

Preferir:

import { AuthProvider, PrivateRoute, useAuth } from "@shared/auth";

ou, quando necessário:

import { AuthProvider } from "@shared/auth/auth-provider";
import { PrivateRoute } from "@shared/auth/private-route";
import { useAuth } from "@shared/auth/auth-context";
Imports antigos que devem ser evitados

Não sugerir novos usos de:

modules/platform-shell/web/src/context/AuthContext
modules/platform-shell/web/src/hooks/useAuth
modules/vox-observatory/web/src/lib/auth-context
modules/vox-observatory/web/src/hooks/useAuth
@shared/hooks/use-auth

Se esses arquivos ainda existirem, devem ser tratados como adapters temporários ou removidos após migração.

Regras para adapters temporários

Se ainda existirem arquivos antigos como:

src/hooks/useAuth.ts
src/context/AuthContext.tsx
src/lib/auth-context.tsx

eles devem apenas reexportar a autenticação oficial:

export { useAuth } from "@shared/auth";

ou:

export { AuthProvider, useAuth } from "@shared/auth";

Não colocar lógica nova nesses arquivos antigos.

Segurança
A rota exige autenticação quando necessário?
Existe validação de papel/permissão?
ADMIN respeita unidadeId?
API não confia apenas no frontend?
req.user está tipado?
Token JWT/Firebase/plataforma é validado no backend?
Permissões por módulo são validadas no backend?
Usuário inativo não deve acessar rotas privadas.
Não confiar em role enviado pelo frontend.
Não confiar em moduleId enviado pelo frontend sem validação.
Não expor dados sensíveis em respostas de API.
Não retornar senha, hash, secrets ou tokens em endpoints públicos.
Não salvar token em locais diferentes sem necessidade.
Não duplicar regras de autorização em vários pontos sem necessidade.
Erros de autorização devem retornar status adequado, como 401 ou 403.
RBAC e Permissões
SUPER pode acessar todos os módulos.
ADMIN pode acessar apenas o que sua regra permitir.
ADMIN deve respeitar escopo de unidadeId quando aplicável.
USER deve acessar apenas o que estiver explicitamente permitido.
Permissões devem ser validadas no backend.
A interface pode esconder ações sem permissão, mas isso não substitui autorização no backend.
Permissões por módulo devem usar IDs oficiais.
Evitar strings soltas de permissões espalhadas pelo código.
Sempre validar moduleId recebido de banco, API, token, formulário ou frontend.
Módulos
Os IDs oficiais de módulos devem vir de shared/constants/modules.
Não criar strings soltas como "vox-observatory" espalhadas pelo código.
Usar MODULE_IDS, ModuleId e isModuleId quando aplicável.
Permissões de usuário devem ser filtradas por módulos válidos.
Módulos exibidos no portal devem vir de configuração centralizada.
URLs dos módulos devem vir de MODULE_URLS.
Cards de módulos devem usar metadados oficiais.
Não duplicar configuração de módulo em vários lugares.
platform-shell é o portal central, não deve ser tratado como módulo comum de card, salvo se houver decisão explícita.
Estrutura recomendada para módulos
shared/constants/modules.ts

Deve centralizar:

IDs dos módulos.
Tipos dos módulos.
URLs base.
Configuração para renderização no portal.
Função de validação isModuleId.
Backend
APIs devem seguir Clean Architecture.
Rotas devem usar Fastify.
Não sugerir middlewares Express se o projeto usa Fastify.
Schemas devem usar Zod e Zod Type Provider.
Controllers devem apenas orquestrar entrada e saída.
Use Cases devem concentrar regra de negócio.
Repositórios devem encapsular persistência.
Erros devem ser tratados de forma padronizada.
Respostas devem seguir padrão consistente.
Endpoints protegidos devem validar autenticação.
Endpoints administrativos devem validar RBAC.
Validações de entrada devem ficar nos schemas.
Não confiar em dados vindos do frontend para autorização.
Zod
Schemas Zod devem ficar próximos das rotas.
Usar z.object, z.enum, z.nativeEnum ou equivalentes quando apropriado.
Validar params, querystring, body e response quando aplicável.
Reaproveitar schemas apenas quando isso não prejudicar clareza.
Evitar any.
Evitar validações manuais duplicadas quando o schema já cobre.
Frontend
A página segue o padrão visual do platform-shell?
Usa main min-h-screen bg-background?
Usa header sticky top-0?
Usa wrappers com mx-auto max-w-7xl px-6?
Usa background com radial gradients?
Usa shared/ui em vez de componentes duplicados?
Usa tokens de tema?
Evita cores fixas?
Botões, cards, modais e tabelas estão consistentes?
O globals.css inclui @source correto para shared?
Se um modal ou botão parecer cru, verificar se o Tailwind está escaneando shared/ui.
Componentes client devem declarar "use client" quando necessário.
Componentes server não devem usar hooks client.
Não duplicar componentes existentes em shared/ui.
Preferir composição com componentes compartilhados.
Evitar estilos inline quando tokens e classes utilitárias resolvem.
Tokens visuais obrigatórios

Preferir sempre tokens como:

bg-background
bg-card
text-foreground
text-card-foreground
text-muted-foreground
border-border
text-primary
bg-primary
text-primary-foreground
bg-accent
text-accent-foreground
ring-ring

Evitar cores fixas como:

bg-white
text-black
border-gray-200
text-gray-500
bg-blue-600

A menos que exista uma justificativa explícita.

Padrão visual para telas

Se o usuário pedir para criar, revisar ou corrigir uma tela, a IA deve ajustar para o padrão visual atual:

Header sticky.
Wrapper mx-auto max-w-7xl px-6.
Background com radial gradients.
Cards com rounded-2xl ou rounded-3xl.
Botões usando shared/ui/button.
Modais usando shared/ui/dialog.
Tabelas usando shared/ui/data-table.
Tokens de tema em vez de cores fixas.
Estados vazios claros.
Loading state.
Mensagens de erro amigáveis.
Layout responsivo.
Espaçamentos consistentes.
Evitar telas cruas ou desalinhadas do padrão consolidado.
Exemplo de estrutura visual recomendada
<main className="min-h-screen bg-background">
  <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-6 px-6 py-4">
      {/* conteúdo do header */}
    </div>
  </header>

  <section className="relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_34rem),radial-gradient(circle_at_top_right,hsl(var(--accent)/0.12),transparent_30rem)]" />

    <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
      {/* conteúdo da página */}
    </div>
  </section>
</main>
UX
Há estado vazio?
Há loading state?
Erros são tratados com toast ou mensagem clara?
Ações perigosas pedem confirmação?
Formulários exibem validações?
Modal fecha corretamente após sucesso?
React Query invalida a query correta após mutações?
Usuário sem permissão recebe mensagem clara?
Usuário não autenticado é redirecionado corretamente?
Usuário autenticado não deve ficar preso em "Carregando...".
Mensagens devem ser claras para usuário não técnico.
Botões devem deixar claro o que fazem.
Ações destrutivas devem ter confirmação.
Formulários devem bloquear envio inválido.
Após criação, edição ou exclusão, listas devem atualizar corretamente.
React Query
Queries devem ter chaves consistentes.
Mutations devem invalidar as queries corretas.
Estados de loading e erro devem ser tratados.
Evitar refetch manual desnecessário quando invalidação resolve.
Não duplicar lógica de fetch em vários componentes.
Hooks de dados podem ficar próximos do domínio quando fizer sentido.
Erros devem gerar feedback visual.
Tailwind v4 em Monorepo
Verificar se o globals.css escaneia corretamente os arquivos do shared.
Se componentes de shared/ui aparecem sem estilo, provavelmente falta @source.
Não criar CSS isolado fora do padrão de tokens.
Preferir tokens CSS centralizados.
Cada módulo pode alterar paleta, mas deve manter estrutura visual.
Evitar estilos globais desnecessários.
Verificação importante

Se componentes compartilhados parecerem “crus”, revisar se existe algo parecido com:

@source "../../../shared/**/*.{ts,tsx}";

O caminho pode variar conforme o módulo.

Componentes compartilhados
Usar shared/ui/button para botões.
Usar shared/ui/dialog para modais.
Usar shared/ui/card para cards.
Usar shared/ui/data-table para tabelas quando disponível.
Não duplicar componentes UI locais sem necessidade.
Se um componente precisa ser usado por mais de um módulo, considerar mover para shared/ui.
Componentes compartilhados devem usar tokens, não cores fixas.
Componentes compartilhados devem ser compatíveis com o tema dos módulos.
Novos módulos

Se o usuário pedir para criar um novo módulo, a IA deve implementar como os módulos atuais, mantendo:

Mesma arquitetura.
Mesma estrutura de pastas.
Mesmo padrão de layout.
Mesmos componentes compartilhados.
Mesmo sistema de autenticação centralizada.
Mesmo RBAC.
Mesmo padrão de tokens CSS.
Mesma estratégia de variáveis de ambiente.
Mesma estratégia de rotas protegidas.
Mesma integração com shared/constants/modules.

A única alteração visual esperada entre módulos deve ser a paleta de cores:

--primary
--primary-foreground
--accent
--accent-foreground
--ring

Não sugerir:

Services genéricos fora do padrão do projeto.
Middlewares Express se o projeto usa Fastify.
CSS isolado fora dos tokens.
Componentes duplicados de UI.
Telas com visual diferente do padrão consolidado.
AuthContext individual por módulo.
Hooks useAuth duplicados.
Rotas privadas locais por módulo.
Variáveis de ambiente
URLs dos módulos devem vir de variáveis de ambiente com fallback local.
Não hardcodar URLs de produção.
Não expor secrets no frontend.
Variáveis NEXT_PUBLIC_* só devem conter valores públicos.
APIs devem ter base URL clara.
Módulos devem usar MODULE_URLS quando aplicável.
Tratamento de erros
Erros técnicos devem ser logados quando necessário.
Usuário deve receber mensagem clara.
Não exibir stack trace no frontend.
Erros de autenticação devem disparar logout ou redirecionamento.
Erros de autorização devem informar falta de permissão.
Erros de validação devem apontar campos inválidos.
Erros inesperados devem ter fallback seguro.
TypeScript
Evitar any.
Usar tipos compartilhados quando existirem.
Não duplicar interfaces iguais em vários lugares.
Preferir type/interface explícitos em contratos importantes.
Validar dados externos antes de confiar no tipo.
Usar type guards quando necessário.
Para IDs de módulo, usar ModuleId.
Para validação de strings externas, usar isModuleId.
Não usar type assertion para esconder erro sem entender a causa.
Imports
Preferir imports a partir de aliases configurados, como @shared.
Manter padrão do projeto para extensão .js em imports internos quando necessário.
Não misturar caminhos antigos e novos de autenticação.
Não importar componentes duplicados de módulos diferentes.
Evitar imports relativos longos quando houver alias.
Remover imports não utilizados.
Regras para refatoração

Antes de refatorar:

Entender o fluxo atual.
Identificar arquivos impactados.
Evitar alterar muitos domínios de uma vez.
Fazer mudanças pequenas e verificáveis.
Preservar comportamento existente quando possível.
Explicar risco da mudança.
Não apagar arquivos antigos sem confirmar se ainda são importados.

Durante a migração para SSO:

Primeiro centralizar shared/auth.
Depois ajustar imports.
Depois remover/adaptar auths antigos.
Depois testar login.
Depois testar telas privadas.
Depois testar permissões por módulo.
Checklist antes de finalizar uma alteração

Sempre que possível, verificar:

pnpm lint
pnpm build

ou o comando equivalente definido no package.json.

Também verificar:

A tela abre sem erro runtime?
Não fica presa em "Carregando..."?
Usuário sem token vai para login?
Usuário com token válido acessa a tela?
Usuário sem permissão vê estado adequado?
Console do navegador está sem erro?
Backend retorna 401/403 corretamente?
Imports antigos foram removidos ou adaptados?
🤖 Nota para IA e Assistentes de Código

Ao ler o contexto deste projeto, priorize sempre:

A arquitetura Clean Architecture para APIs.
A validação com Zod e Zod Type Provider.
A autenticação centralizada via SSO no platform-shell.
A autorização por RBAC.
O uso de componentes compartilhados de shared/ui.
O padrão visual implementado no platform-shell.
A configuração correta do Tailwind v4 em monorepo.
A criação de novos módulos seguindo a mesma estrutura visual e técnica.
A não duplicação de autenticação, componentes ou regras.
A segurança no backend como fonte real de autorização.
Regra mais importante sobre autenticação

Este projeto está migrando de autenticação individual por módulo para SSO centralizado.

Portanto:

Não recriar autenticação dentro de cada módulo.
Não duplicar providers, hooks ou rotas privadas.
Não sugerir AuthContext local dentro de modules/*.
Não proteger /login com PrivateRoute.
Centralizar o estado autenticado em shared/auth.
Usar o token platform-token como token compartilhado entre módulos.
Backend de cada módulo deve validar o token recebido.
Frontend apenas consome o estado autenticado; ele não é fonte de verdade de permissão.
Regra mais importante para novas telas

Se o usuário pedir para criar, revisar ou corrigir uma tela, a IA deve ajustar para o padrão visual atual:

Header sticky.
Wrapper mx-auto max-w-7xl px-6.
Background com radial gradients.
Cards com rounded-2xl ou rounded-3xl.
Botões usando shared/ui/button.
Modais usando shared/ui/dialog.
Tabelas usando shared/ui/data-table.
Tokens de tema em vez de cores fixas.
Regra mais importante para novos módulos

Se o usuário pedir para criar um novo módulo, a IA deve implementar como os módulos atuais, mantendo:

Mesma arquitetura.
Mesma estrutura de pastas.
Mesmo padrão de layout.
Mesmos componentes compartilhados.
Mesmo sistema de autenticação centralizada.
Mesmo RBAC.
Mesmo padrão de tokens CSS.

A única alteração visual esperada entre módulos deve ser a paleta de cores:

--primary
--primary-foreground
--accent
--accent-foreground
--ring
Prompt recomendado para migração de autenticação

Quando for pedir ajuda ao agente para mexer em autenticação, usar este prompt:

Estamos migrando de autenticação individual por módulo para SSO centralizado no platform-shell.

Antes de alterar qualquer arquivo:

1. Liste todos os AuthContext, useAuth, AuthProvider e PrivateRoute existentes.
2. Identifique quais são duplicados ou antigos.
3. Confirme qual arquivo está sendo usado por cada módulo.
4. Identifique imports quebrados ou conflitantes.
5. Não implemente ainda.

Depois, proponha uma migração em pequenos passos para centralizar a autenticação em shared/auth.
Prompt recomendado para corrigir erro de runtime

Quando houver erro no terminal ou navegador, usar este prompt:

Analise este erro de runtime/build no contexto do monorepo.

Antes de corrigir:

1. Identifique o arquivo exato que está quebrando.
2. Explique qual import, export ou contrato está inconsistente.
3. Verifique se o erro tem relação com a migração para SSO centralizado.
4. Não aplique quick fix aleatório.
5. Proponha a menor alteração segura.
Prompt recomendado para criar nova tela

Quando for criar ou revisar tela, usar este prompt:

Crie ou ajuste esta tela seguindo o padrão visual atual do platform-shell.

Obrigatório:

- Usar main min-h-screen bg-background.
- Usar header sticky top-0 quando houver cabeçalho.
- Usar wrapper mx-auto max-w-7xl px-6.
- Usar background com radial gradients quando fizer sentido.
- Usar componentes de shared/ui.
- Usar tokens de tema, nunca cores fixas.
- Criar loading state.
- Criar empty state.
- Tratar erros com mensagem clara ou toast.
- Respeitar autenticação centralizada em shared/auth.
Prompt recomendado para criar novo módulo

Quando for criar novo módulo, usar este prompt:

Crie este novo módulo seguindo o padrão atual do monorepo.

Obrigatório:

- Mesma arquitetura dos módulos existentes.
- Mesmo padrão visual do platform-shell.
- Autenticação centralizada via shared/auth.
- RBAC validado no backend.
- IDs registrados em shared/constants/modules.
- URLs configuradas em MODULE_URLS.
- Componentes vindos de shared/ui.
- Tailwind v4 configurado para escanear shared.
- Não criar AuthContext local.
- Não duplicar componentes UI.
```
