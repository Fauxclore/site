const QUANTOS = 5;

export async function onRequestGet({ request, env }) {
  const after = Number(new URL(request.url).searchParams.get("after")) || 0;

  let { results } = await env.DB.prepare(
    "SELECT id, symbol FROM clicks WHERE id > ? ORDER BY id LIMIT ?",
  )
    .bind(after, QUANTOS)
    .all();

  if (results.length < QUANTOS) {
    const more = await env.DB.prepare(
      "SELECT id, symbol FROM clicks ORDER BY id LIMIT ?",
    )
      .bind(QUANTOS - results.length)
      .all();
    results = results.concat(more.results);
  }

  const last = results.length ? results[results.length - 1].id : 0;

  return Response.json(
    { items: results, cursor: last },
    { headers: { "Cache-Control": "no-store" } },
  );
}
