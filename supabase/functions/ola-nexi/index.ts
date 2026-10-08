// ola-nexi: responde com uma saudação para o nome recebido no corpo JSON.
// 200 com nome, 400 sem nome, 401 sem cabeçalho Authorization.

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (req) => {
  // O gateway do Supabase já barra chamadas sem JWT (verify_jwt), mas a função
  // não depende só disso: se um dia o verify_jwt for desligado, a regra continua.
  if (!req.headers.get("Authorization")) {
    return json({ erro: "Cabeçalho Authorization ausente." }, 401);
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    // Corpo vazio ou JSON inválido cai no mesmo 400 de "sem nome".
  }

  const nome = typeof (body as { nome?: unknown })?.nome === "string"
    ? (body as { nome: string }).nome.trim()
    : "";

  if (!nome) {
    return json({ erro: "Informe o campo \"nome\" no corpo JSON." }, 400);
  }

  return json({ mensagem: `Olá, ${nome}!` }, 200);
});
