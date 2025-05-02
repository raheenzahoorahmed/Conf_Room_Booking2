export async function onRequestGet(context) {
  const { db } = context.env;
  const { results } = await db.prepare('SELECT * FROM rooms').all();
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
} 