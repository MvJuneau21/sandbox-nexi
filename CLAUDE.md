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

## Aprendizados

- **Contexto antes de pedir:** dizer o objetivo, as restrições (HTML/CSS/JS puros) e onde o código vai morar evita retrabalho.
- **Planejar antes de mudar:** em tarefas com vários arquivos, usar o modo de planejamento e só aprovar quando o plano estiver claro.
- **Permissões com critério:** ler cada comando antes de aprovar, principalmente os que alteram arquivos, fazem commit ou push.
- **Revisar o diff:** rodar `git diff` e testar a tela antes de todo commit; a IA erra e quem aprova é responsável.
- **`fetch` não falha em 404:** sempre conferir `response.ok` e mostrar o erro na tela, não só no console.
- **Dados com `textContent`:** nunca montar HTML com `innerHTML` a partir de dados externos.
- **Atributo `hidden` + CSS:** um `display` no CSS anula o `hidden`; manter `[hidden] { display: none !important; }`.
- **Celular primeiro:** testar no modo dispositivo do DevTools (Ctrl+Shift+M) e conferir que não há rolagem horizontal.
