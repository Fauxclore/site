export async function onRequestGet({ request, env }) {
  const params = new URL(request.url).searchParams;
  const after = Number(params.get("after")) || 0;
  const limit = Math.min(Math.max(Number(params.get("limit")) || 200, 1), 200);

  const { results } = await env.DB.prepare(
    "SELECT id, symbol, t FROM clicks WHERE id > ? ORDER BY id LIMIT ?",
  )
    .bind(after, limit)
    .all();

  return Response.json(
    { items: results },
    { headers: { "Cache-Control": "no-store" } },
  );
}
