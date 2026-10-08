# Sandbox Nexi

## Regras do projeto

1. **Simplicidade primeiro:** use HTML, CSS e JavaScript puros; não adicione frameworks ou dependências sem necessidade clara.
2. **Idioma:** conteúdo visível ao usuário em português (pt-BR); nomes de variáveis, funções e arquivos em inglês.
3. **HTML semântico e acessível:** use tags semânticas, `alt` em imagens e mantenha `lang="pt-BR"` no documento.
4. **Commits pequenos e descritivos:** um commit por mudança lógica, com mensagem no imperativo explicando o quê e por quê.
5. **Nada de segredos no repositório:** o repositório é público — nunca versione tokens, senhas ou chaves de API.

## Como rodar

O `fetch` de arquivos locais não funciona abrindo o HTML direto (`file://`). Suba um servidor na pasta do projeto:

```
python -m http.server 8000
```

E abra `http://localhost:8000/leads.html`.

Antes de commitar uma tela, rode a skill `revisar-tela` (`.claude/skills/revisar-tela/`).

## Supabase

- **Projeto:** `sandbox-nexi` (`zrkkpmtvduskdsbkcuuu`), na organização pessoal. Nunca é o banco da Nexi.
- **MCP:** `.mcp.json` aponta para `https://mcp.supabase.com/mcp` com login OAuth (`/mcp` → `supabase` → Authenticate). Funciona sem `project_ref` só porque a conta não participa de nenhuma organização da Nexi. **Se a conta entrar na organização da Nexi, troque por token de acesso com permissão mínima** (Project: Settings/Advisors/Logs em leitura; Database: SQL e Migrations em leitura e escrita), via variável de ambiente `SUPABASE_ACCESS_TOKEN`, nunca no arquivo.
- **Bloqueios:** `.claude/settings.json` nega deploy de Edge Function, secrets, branches, criar/pausar projeto e `supabase db push`/`functions deploy`. Publicar é sempre manual e acompanhado.
- **Migrations:** ficam em `supabase/migrations/` e são aplicadas pelo MCP (`apply_migration`). Depois de aplicar, rodar os advisors de segurança.
- **Função local sem Docker:** o `supabase start` baixa de 5 a 8 GB. Para funções que não usam o banco, rode só o Deno (cerca de 100 MB), fora da porta 8000 do servidor das telas:

```
$env:DENO_SERVE_ADDRESS = "tcp:127.0.0.1:8787"; npx deno@2.5.6 run --allow-net supabase/functions/ola-nexi/index.ts
```

## Aprendizados

- **Contexto antes de pedir:** dizer o objetivo, as restrições (HTML/CSS/JS puros) e onde o código vai morar evita retrabalho.
- **Planejar antes de mudar:** em tarefas com vários arquivos, usar o modo de planejamento e só aprovar quando o plano estiver claro.
- **Permissões com critério:** ler cada comando antes de aprovar, principalmente os que alteram arquivos, fazem commit ou push.
- **Revisar o diff:** rodar `git diff` e testar a tela antes de todo commit; a IA erra e quem aprova é responsável.
- **`fetch` não falha em 404:** sempre conferir `response.ok` e mostrar o erro na tela, não só no console.
- **Dados com `textContent`:** nunca montar HTML com `innerHTML` a partir de dados externos.
- **Atributo `hidden` + CSS:** um `display` no CSS anula o `hidden`; manter `[hidden] { display: none !important; }`.
- **Celular primeiro:** testar no modo dispositivo do DevTools (Ctrl+Shift+M) e conferir que não há rolagem horizontal.
- **Teste passando não prova que o arquivo mudou:** uma edição da IA pode ser desfeita no caminho (ex.: `\u0300` virando o caractere invisível). Confirmar no `git diff`.
- **Caracteres invisíveis no código:** escrever faixas Unicode como escape (`/[\u0300-\u036f]/`), nunca o caractere colado.
- **Grant antes de policy:** o Postgres confere primeiro o grant (o papel pode usar a tabela?) e só depois a policy de RLS (quais linhas?). Policy sem grant dá `permission denied for table`; com grant e fora da policy, a leitura volta vazia e a escrita dá `violates row-level security policy`.
- **Grant automático do Supabase:** tabelas novas em `public` recebem grant para `anon` e `authenticated`. Na migration, `revoke all` primeiro e depois `grant` só o necessário.
- **Testar RLS pelo SQL:** dentro de `begin … rollback`, usar `set local role authenticated` e `set_config('request.jwt.claims', '{"sub":"<uuid>","role":"authenticated"}', true)`.
- **401 em duas camadas:** no Supabase, o gateway (`verify_jwt`) barra chamadas sem JWT antes da função; a função também confere o `Authorization` para não depender só disso. Conferir a presença do cabeçalho não valida o token.
- **MCP com `?project_ref=` quebra o login OAuth** (`Resource must be a valid MCP endpoint`). Alternativa segura: token de acesso com permissão mínima.
- **`innerHTML` com dado executa código:** um nome `<img src=x onerror=alert(1)>` disparou o alerta com `innerHTML`; com `textContent` apareceu como texto. Demonstração de falha nunca vai para commit.
- **Varredura de segredos mostra tipo e local, nunca o valor:** mascarar dentro do próprio comando, antes de qualquer saída. O regex do `padroes.md` §9 só cobre `var/const/let` com aspas duplas; procurar também prefixos (`sb_secret_`, `sbp_`, `sk-`, JWT) e fallback literal em `os.environ.get`. Achado vai ao Guilherme no mesmo dia, com arquivo e linha.
- **RLS transforma "não pode ver" em "não achou":** a consulta volta vazia, sem erro. Já um `permission denied` é falha e tem que aparecer como erro, nunca como lista vazia.
- **Achado de revisão fora do escopo vira issue**, não correção no meio de outra tarefa.
