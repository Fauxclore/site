const MAX_PER_POLL = 100;

export async function onRequestGet({ request, env }) {
  const param = new URL(request.url).searchParams.get("after");
  const headers = { "Cache-Control": "no-store" };

  if (param === null || param === "latest") {
    const row = await env.DB.prepare("SELECT MAX(id) AS m FROM clicks").first();
    return Response.json(
      { items: [], cursor: (row && row.m) || 0 },
      { headers },
    );
  }

  const after = Number(param) || 0;
  const { results } = await env.DB.prepare(
    "SELECT id, symbol FROM clicks WHERE id > ? ORDER BY id LIMIT ?",
  )
    .bind(after, MAX_PER_POLL)
    .all();

  const cursor = results.length ? results[results.length - 1].id : after;
  return Response.json({ items: results, cursor }, { headers });
}
