export async function onRequestGet({ request, env }) {
  const after = Number(new URL(request.url).searchParams.get("after")) || 0;

  const { results } = await env.DB.prepare(
    "SELECT id, symbol, t FROM clicks WHERE id > ? ORDER BY id LIMIT 200",
  )
    .bind(after)
    .all();

  return Response.json(
    { items: results },
    { headers: { "Cache-Control": "no-store" } },
  );
}
