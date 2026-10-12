export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }

  const symbol = body && body.symbol;
  if (typeof symbol !== "string" || !/^[a-z0-9-]{1,32}$/.test(symbol)) {
    return new Response("bad symbol", { status: 400 });
  }

  await env.DB.prepare("INSERT INTO clicks (symbol) VALUES (?)")
    .bind(symbol)
    .run();

  return new Response(null, { status: 204 });
}
