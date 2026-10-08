---
name: revisar-tela
description: >
  Revisa uma tela do sandbox-nexi (HTML, CSS e JS puros) em 4 critérios: dados
  inseridos com textContent, cor só por variável CSS, funciona no celular e erro de
  rede mostrado na tela. Use quando o usuário pedir para "revisar a tela", "conferir
  a tela X", "passar o revisar-tela" ou antes de commitar uma tela nova. Só aponta
  problemas com evidência (arquivo e linha); não corrige sem o usuário pedir.
allowed-tools: Read, Grep, Glob, Bash
---

# Skill — Revisar tela

## Regra de ouro

Cada critério termina em **✅ passou** ou **❌ falhou**, sempre com evidência:
arquivo, linha e o trecho lido. "Parece certo" não conta. Se não houver nada a corrigir,
a evidência é a prova de que não havia.

Não altere arquivos durante a revisão. Liste as correções e pergunte antes de aplicar.

## Passo 0 — Identificar a tela

Descubra o HTML da tela (pergunte se não estiver claro) e siga os `<link rel="stylesheet">`
e `<script src>` dele até os arquivos CSS e JS próprios da tela. Leia os três inteiros.

## Critério 1 — Texto com `textContent`

Dado que vem de fora (JSON, API, campo digitado) nunca entra no DOM como HTML.

1. Procure por `innerHTML`, `outerHTML`, `insertAdjacentHTML` e `document.write` nos JS.
2. Cada ocorrência que receba dado externo é **❌**. Só HTML fixo, escrito no próprio
   código e sem variáveis, é aceitável, mas aponte assim mesmo como atenção.
3. Confirme que os dados são inseridos com `textContent`, `createElement` ou `append`.
4. Confira atributos montados com dado externo: `href` com `javascript:` ou dado sem
   prefixo fixo (como `mailto:`) também é **❌**.

## Critério 2 — Cor só por variável

Toda cor do CSS vem de uma variável declarada em `:root`.

1. Procure nos CSS por `#hex`, `rgb(`, `rgba(`, `hsl(`, `hsla(` e nomes de cor
   (`red`, `white`, `black`…).
2. Cores dentro do bloco `:root` que definem `--variáveis` são o lugar certo: **✅**.
3. Qualquer cor literal fora de `:root` é **❌**. Liste cada linha.
4. Procure também por `style=` com cor no HTML e `.style.color`/`.style.background`
   no JS.
5. `currentColor`, `transparent` e `inherit` são permitidos.

## Critério 3 — Funciona no celular

1. O HTML tem `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
2. O CSS parte do celular: estilos base de uma coluna e `@media (min-width: …)` para
   telas maiores. `max-width` com layout de desktop na base é **❌**.
3. Nada força largura maior que 375px: procure `width:` e `min-width:` em px acima de
   375, `white-space: nowrap` em texto longo e textos longos (e-mail, URL) sem
   `overflow-wrap`.
4. `box-sizing: border-box` aplicado e campos com `width: 100%`.
5. Diga ao usuário que a prova final é visual: DevTools no modo dispositivo, iPhone SE
   (375px), sem rolagem horizontal. A skill não substitui esse teste.

## Critério 4 — Erro de rede na tela

1. Todo `fetch` confere `response.ok` (o `fetch` não falha sozinho em 404/500).
2. Existe `try/catch` (ou `.catch`) em volta do `fetch` e da leitura do JSON.
3. No erro, uma mensagem em português aparece **na tela**, num elemento com
   `role="alert"`. Só `console.error` é **❌**.
4. Se o elemento de erro usa o atributo `hidden`, o CSS precisa ter
   `[hidden] { display: none !important; }`, senão um `display` no CSS o anula.
5. Sugira o teste manual: renomear o JSON por um momento, recarregar e ver a mensagem.

## Relatório

Termine com uma tabela:

| Critério | Resultado | Evidência |
|---|---|---|
| 1. textContent | ✅/❌ | `arquivo:linha` — trecho |
| 2. Cor por variável | ✅/❌ | … |
| 3. Celular | ✅/❌ | … |
| 4. Erro de rede | ✅/❌ | … |

Depois, a lista de correções propostas (o quê, onde e por quê) e a pergunta se o usuário
quer que sejam aplicadas.
